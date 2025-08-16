import os
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from ultralytics import YOLO
from PIL import Image
from io import BytesIO
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

# --- Configuration & Initialization ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")
INDEX_NAME = "cpcb-guidelines-rag"
MODEL_NAME = "all-MiniLM-L6-v2"

if not all([GROQ_API_KEY, PINECONE_API_KEY, PINECONE_ENVIRONMENT]):
    raise ValueError("Missing Groq and Pinecone API keys/environment in .env file.")

groq_client = Groq(api_key=GROQ_API_KEY)
yolo_model = YOLO('yolov8n.pt')
embedding_model = SentenceTransformer(MODEL_NAME)
pinecone_client = Pinecone(api_key=PINECONE_API_KEY)
pinecone_index = pinecone_client.Index(INDEX_NAME)

app = FastAPI()

# Configure CORS
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a specific list of e-waste categories for filtering YOLO output
E_WASTE_CATEGORIES = ['cell phone', 'laptop', 'tv', 'keyboard', 'mouse', 'printer', 'monitor', 'microwave', 'refrigerator', 'washing machine', 'battery', 'pcb']

def get_yolo_object_description(pil_image):
    """
    Analyzes an image with YOLO and returns a comma-separated string of
    detected e-waste objects.
    """
    yolo_results = yolo_model(pil_image)
    detected_objects = [
        yolo_model.names[int(c)] for r in yolo_results for c in r.boxes.cls
        if yolo_model.names[int(c)] in E_WASTE_CATEGORIES
    ]
    unique_objects = list(set(detected_objects))
    return ", ".join(unique_objects) if unique_objects else None

@app.get("/")
def read_root():
    return {"message": "E-waste classification backend is running!"}

@app.post("/generate_questions")
async def generate_questions(image: UploadFile = File(...), user_description: str = Form(...)):
    """
    Receives an image and user description, uses YOLO to identify the object,
    retrieves relevant CPCB guidelines, and generates 3-4 questions.
    """
    try:
        contents = await image.read()
        pil_image = Image.open(BytesIO(contents))
        
        object_description = get_yolo_object_description(pil_image)
        print(f"YOLO detected objects: {object_description}")

        if not object_description:
            questions = [
                {
                    "id": 1,
                    "text": f"You described the item as: '{user_description}'. Is it in working condition?",
                    "options": [
                        {"value": "Yes", "label": "Yes"},
                        {"value": "No", "label": "No"}
                    ]
                },
                {
                    "id": 2,
                    "text": f"Based on your description, does the item contain a screen or battery?",
                    "options": [
                        {"value": "Yes", "label": "Yes"},
                        {"value": "No", "label": "No"}
                    ]
                },
                {
                    "id": 3,
                    "text": f"Is the item severely damaged or are internal components exposed?",
                    "options": [
                        {"value": "Yes", "label": "Yes"},
                        {"value": "No", "label": "No"}
                    ]
                }
            ]
            return JSONResponse(content={"object_description": "unidentified electronic object", "questions": questions})

        query_embedding = embedding_model.encode(f"Rules and guidelines for {object_description}").tolist()
        search_results = pinecone_index.query(vector=query_embedding, top_k=3, include_metadata=True)
        retrieved_context = "\n".join([item['metadata']['text'] for item in search_results['matches']])

        prompt = f"""
        You are an expert in e-waste management and CPCB guidelines. A user has uploaded an image of an e-waste item which has been identified as "{object_description}" and provided the following description: "{user_description}".
        You have the following official CPCB guidelines as context:
        ---
        {retrieved_context}
        ---
        Based on this information, generate a JSON object containing 3 or 4 relevant multiple-choice questions to help you determine if the item is "Hazardous", "Reusable", or "Recyclable". The questions should ask about the item's condition, functionality, and specific components. The options should be simple "Yes" or "No" answers.

        Please ensure the JSON is perfectly formatted and complete.
        {{
          "questions": [
            {{
              "id": 1,
              "text": "...",
              "options": [
                {{"value": "Yes", "label": "..."}},
                {{"value": "No", "label": "..."}}
              ]
            }},
            ...
          ]
        }}
        """
        
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
            response_format={"type": "json_object"},
            max_tokens=1024,
            temperature=0.7,
        )
        
        try:
            questions_json = json.loads(chat_completion.choices[0].message.content)
            return JSONResponse(content={"object_description": object_description, **questions_json})
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="LLM returned invalid JSON. Please try again.")

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")

@app.post("/classify")
async def classify_e_waste(
    mcq_answers: str = Form(...),
    object_description: str = Form(...),
    user_description: str = Form(...)
):
    """
    Receives the image, MCQ answers, and YOLO result,
    and returns the final classification and explanation.
    """
    try:
        query_embedding = embedding_model.encode(f"Rules for {object_description}").tolist()
        search_results = pinecone_index.query(vector=query_embedding, top_k=3, include_metadata=True)
        retrieved_context = "\n".join([item['metadata']['text'] for item in search_results['matches']])

        prompt = f"""
        You are an expert in e-waste management and CPCB guidelines.
        Your task is to classify an e-waste item into one of the following three categories: "Hazardous", "Recyclable", or "Reusable".

        Here are the official CPCB guidelines for your reference:
        ---
        {retrieved_context}
        ---
        
        The object has been identified as "{object_description}" and the user provided the following description: "{user_description}".
        The user's answers to the questions were: {mcq_answers}

        Please ensure the JSON is perfectly formatted and complete.
        {{
          "classification": "Hazardous" | "Recyclable" | "Reusable",
          "explanation": "A detailed explanation based on the identified object, user's answers, and retrieved guidelines."
        }}
        """
        
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
            response_format={"type": "json_object"},
            max_tokens=1024,
            temperature=0.7,
        )
        
        return JSONResponse(content=json.loads(chat_completion.choices[0].message.content))
    
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="LLM returned invalid JSON for classification.")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during final classification.")
