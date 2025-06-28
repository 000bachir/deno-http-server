import "jsr:@std/dotenv/load";
import mongoose from "mongoose";
import { GetVar } from "../utils/getVar.ts";
const mongo_uri = GetVar("MONGODB_CONNECTION_STRING") as string;

export async function DatabaseConnection() {
  try {
    await mongoose.connect(mongo_uri);
    console.log("✅ Mongoose connected to MongoDB!");
  } catch (err) {
    console.error("❌ Mongoose connection failed:", err);
  }
}
