# ingest.py
import os
from pypdf import PdfReader
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

# --- Configuration ---
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")  # e.g., "gcp-starter"
INDEX_NAME = "cpcb-guidelines-rag"
MODEL_NAME = "all-MiniLM-L6-v2"
PDF_DIR = "pdfs"

if not all([PINECONE_API_KEY, PINECONE_ENVIRONMENT]):
    raise ValueError("Missing Pinecone API key or environment in .env file.")

# Initialize clients and models
pinecone_client = Pinecone(api_key=PINECONE_API_KEY)
embedding_model = SentenceTransformer(MODEL_NAME)

def read_pdfs(pdf_directory):
    """Reads all PDF files in a directory and returns their text content."""
    all_text = ""
    for filename in os.listdir(pdf_directory):
        if filename.endswith(".pdf"):
            filepath = os.path.join(pdf_directory, filename)
            print(f"Reading {filename}...")
            reader = PdfReader(filepath)
            for page in reader.pages:
                all_text += page.extract_text() + "\n"
    return all_text

def chunk_text(text, chunk_size=500):
    """Splits a large text into smaller chunks."""
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunks.append(" ".join(words[i:i+chunk_size]))
    return chunks

def main():
    if not os.path.exists(PDF_DIR):
        print(f"Directory '{PDF_DIR}' not found. Please create it and add your PDF files.")
        return

    # Check if index exists, if not, create it
    if INDEX_NAME not in pinecone_client.list_indexes():
        print(f"Creating Pinecone index '{INDEX_NAME}'...")
        pinecone_client.create_index(
            name=INDEX_NAME, 
            dimension=embedding_model.get_sentence_embedding_dimension(), 
            metric='cosine',
            spec=ServerlessSpec(cloud='aws', region='us-east-1')
        )
    
    index = pinecone_client.Index(INDEX_NAME)

    # Read and chunk the PDF content
    raw_text = read_pdfs(PDF_DIR)
    chunks = chunk_text(raw_text)

    # Generate embeddings and upload to Pinecone
    print(f"Generating embeddings and uploading {len(chunks)} chunks to Pinecone...")
    vectors = []
    for i, chunk in enumerate(chunks):
        embedding = embedding_model.encode(chunk).tolist()
        vectors.append({
            "id": f"chunk-{i}", 
            "values": embedding, 
            "metadata": {"text": chunk}
        })
    
    # Upload in batches for efficiency
    index.upsert(vectors=vectors)
    print("Pinecone index populated successfully.")

if __name__ == "__main__":
    main()
