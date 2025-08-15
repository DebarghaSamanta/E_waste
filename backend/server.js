import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start the server
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to connect to MongoDB or start server:", err);
    process.exit(1); // Exit process if server fails to start
  }
};

startServer();
