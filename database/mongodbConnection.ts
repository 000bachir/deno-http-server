import "jsr:@std/dotenv/load";
import mongoose from "mongoose";
const mongo_uri = Deno.env.get("MONGODB_CONNECTION_STRING") as string



export async function DatabaseConnection(){
    try {
        await mongoose.connect(mongo_uri)
        console.log("✅ Mongoose connected to MongoDB!");
    }catch (err){
        console.error("❌ Mongoose connection failed:", err);
    }
}