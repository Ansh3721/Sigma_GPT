import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiResponse = async (messages) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert your DB messages to Gemini-compatible format
    const formattedMessages = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const result = await model.generateContent({
      contents: formattedMessages
    });

    const responseText = result.response.text();
    console.log("Gemini says:", responseText);

    return responseText;

  } catch (err) {
    console.error("❌ Gemini API Error:", err);
    throw new Error("Error with Gemini API");
  }
};

export default getGeminiResponse;
