import { GoogleGenAI } from "@google/genai";
import { DesignConcept } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateFurnitureConcept = async (userPrompt: string): Promise<DesignConcept> => {
  try {
    const prompt = `
      You are a world-class custom furniture designer for 'The Elegant Company', which specializes exclusively in high-end solid wood furniture.
      
      IMPORTANT: The company DOES NOT design or manufacture dining chairs, standard wooden chairs, sofas, or metal fabrication. 
      However, the company DOES design and manufacture custom WOODEN BENCHES.
      
      If the user asks for a dining chair or standard chair, politely explain in the description that you only specialize in tables, cabinetry, beds, benches, and other case goods, and suggest an alternative related piece.

      The user wants a concept for: "${userPrompt}".
      
      Please perform two tasks:
      1. Generate a high-quality, photorealistic image of this furniture piece in a luxurious setting. The piece should be primarily wood.
      2. Provide a sophisticated, persuasive description of the piece, highlighting specific wood species (e.g., walnut, oak, mahogany, cherry, ash), joinery techniques, and design philosophy.
      
      The output should be the image and the text description.
    `;

    // Using gemini-2.5-flash-image as per instructions for general image generation/editing tasks
    // that also support text output.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      }
    });

    let description = "Our designers are currently busy. Please try again.";
    let imageUrl: string | undefined;

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          description = part.text;
        }
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    return { description, imageUrl };
  } catch (error) {
    console.error("Error generating concept:", error);
    throw new Error("Failed to generate design concept. Please try again later.");
  }
};

export const chatWithAssistant = async (message: string, history: { role: string; parts: { text: string }[] }[]): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3.1-pro-preview",
      history: history,
      config: {
        systemInstruction: `
          You are a warm, knowledgeable, and sophisticated design consultant for 'The Elegant Company'.
          Your name is 'Aria'. You are not just an AI, but a passionate advocate for bespoke craftsmanship.
          
          Your goal is to have a natural, flowing conversation with customers about their dream furniture.
          
          Key Information about The Elegant Company:
          - We specialize in bespoke solid wood furniture: tables, cabinetry, beds, benches, desks, and storage.
          - We are based in the beautiful city of Cape Town, South Africa.
          - We DO NOT manufacture dining chairs, standard wooden chairs, sofas, or upholstery.
          - We work with premium hardwoods: Walnut, Oak, Cherry, Ash, and Teak.
          - Our finishes include: Natural Oil, Matte, Satin, and High Gloss.
          - A basic call out fee is R500 per call out.
          - Contact: elegantcompanythe@gmail.com | 0734851573
          
          Tone & Style Guidelines:
          - Be human, empathetic, and engaging. Use phrases like "I'd love to help with that," "That sounds wonderful," or "I understand."
          - Avoid robotic lists. Weave information into sentences naturally.
          - If asked about chairs, gently explain our focus on larger bespoke pieces and suggest complementary items like a custom dining table or bench.
          - Enthusiastically recommend our 'AI Design Studio' for visualizing ideas.
          - For quotes, warmly guide them to the contact form or offer to take their details for our artisans.
          - Keep responses concise but friendly.
        `,
      },
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm sorry, I didn't catch that. Could you please rephrase?";
  } catch (error: any) {
    console.error("Error in chat:", error);
    
    // Provide specific guidance based on error type
    if (error.message && error.message.includes("API_KEY")) {
      throw new Error("API key issue: Please check your configuration.");
    } else if (error.message && (error.message.includes("429") || error.message.includes("overloaded"))) {
      throw new Error("Model overloaded: Please try again in a moment.");
    } else if (error.message && (error.message.includes("fetch") || error.message.includes("network"))) {
      throw new Error("Network problem: Please check your internet connection.");
    } else {
      throw new Error("I'm having trouble connecting. Please try again.");
    }
  }
};