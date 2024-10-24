import mongoose from "mongoose";
import app from "./app";

const port = process.env.PORT || 3000;
const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;

const startServer = async () => {
  try {
    await mongoose.connect(mongoURI);
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error on application startup:", error);
    process.exit(1);
  }
};

startServer();
