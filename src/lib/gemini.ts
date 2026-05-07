import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getFoodStorageAdvice(foodName: string) {
  try {
    const prompt = `Provide a single, very short (max 15 words) tip for storing ${foodName} to make it last longer. Be specific but concise.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return response.text || "Keep in a cool, dry place.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Keep in a cool, dry place.";
  }
}
