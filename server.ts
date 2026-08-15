import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse json requests
  app.use(express.json());

  // API Route: Chat with Eleanor
  app.post('/api/chat', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(401).json({ 
          error: "GEMINI_API_KEY is not configured on this environment. Please set the GEMINI_API_KEY in the Settings menu to activate Eleanor." 
        });
      }

      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Convert messages to Gemini format: { role: 'user' | 'model', parts: [{ text: string }] }
      // This is Eleanor: elegant South African-voiced, friendly aesthetic home consultant.
      const systemInstruction = `You are Eleanor, a friendly, professional, warm, and highly skilled design consultant for The Elegant Company, a high-end home improvement and solid wood furnishing workshop based in Cape Town, South Africa.

Your character and conversational guidelines:
1. Greet the user warmly and introduce yourself. Your tone is refined, hospitable, and high-end, yet accessible—matching the luxury agency quality of The Elegant Company.
2. Guide users step-by-step through a friendly intake script:
   - Understand their Project Type: "Custom Furniture" (handcrafted dining tables, credenzas, beds), "Furniture Restoration" (restoring heritage family heirlooms), or "Kitchens & Built-ins" (bespoke kitchen remodeling or closet built-ins).
   - Select their Wood & Style Preferences (e.g., Modern minimalist, organic slab, French country rustics using Walnut, French Oak, Knysna Blackwood, Ash, etc.).
   - Assess their Budget/Investment scale (range for custom furniture starts at R20,000; built-ins and kitchens start at R80,000).
   - Gather their client Name and Email address.
   - Help identify a preferred Date & Time for their online or studio consultation callback.
3. Automatically schedule their calendar slot: When they provide a preferred date/time and are ready, call the 'bookConsultation' tool. Make sure to collect Name, Email, Project Type, and preferred date/time before scheduling!
4. STRICT MANDATE: Never assume confirmation numbers, calendar links, or success before actually calling the tool 'bookConsultation' and receiving positive feedback!
5. After the function confirms success, report joyfully and elegantly that the booking is complete and secured on their Google Calendar in real-time. Give them the summary of their appointment!
6. LANGUAGE RULE: Respond in the exact language the user is speaking or typing. You must default to English, and ONLY switch to and respond in Afrikaans once the user starts talking or writing in Afrikaans. If the user is speaking English, reply in English.

Today is ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. Speak with natural poise, elegance, and warm reassurance. Keep your responses concise (3-4 sentences maximum per turn) to hold an authentic dialogue.`;

      // Format messages for @google/genai
      const contents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents,
          config: {
            systemInstruction,
            tools: [
              {
                functionDeclarations: [
                  {
                    name: 'bookConsultation',
                    description: 'Schedules a real-time consultation appointment directly on the client\'s Google Calendar.',
                    parameters: {
                      type: Type.OBJECT,
                      properties: {
                        projectType: { 
                          type: Type.STRING, 
                          description: 'The style of work: Custom Furniture, Restoration, or Kitchens & Built-ins.' 
                        },
                        budget: { 
                          type: Type.STRING, 
                          description: 'The estimated budget or specification.' 
                        },
                        stylePreferences: { 
                          type: Type.STRING, 
                          description: 'Style profile (e.g., Organic Minimalist, Classical Rustics, Solid French Oak, etc.).' 
                        },
                        dateTime: { 
                          type: Type.STRING, 
                          description: 'The requested appointment start time in ISO 8601 format (e.g., "2026-06-25T14:30:00"). Ensure it is programmed during typical South African business hours (09:00 - 17:00).' 
                        },
                        clientName: {
                          type: Type.STRING,
                          description: 'Client name.'
                        },
                        clientEmail: {
                          type: Type.STRING,
                          description: 'Client email to receive the Google Calendar invitation.'
                        }
                      },
                      required: ['projectType', 'dateTime', 'clientName', 'clientEmail']
                    }
                  }
                ]
              }
            ]
          }
        });
      } catch (geminiErr: any) {
        console.warn("gemini-3.5-flash failed or is experiencing high demand. Falling back to gemini-3.1-flash-lite...", geminiErr.message || geminiErr);
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: {
            systemInstruction,
            tools: [
              {
                functionDeclarations: [
                  {
                    name: 'bookConsultation',
                    description: 'Schedules a real-time consultation appointment directly on the client\'s Google Calendar.',
                    parameters: {
                      type: Type.OBJECT,
                      properties: {
                        projectType: { 
                          type: Type.STRING, 
                          description: 'The style of work: Custom Furniture, Restoration, or Kitchens & Built-ins.' 
                        },
                        budget: { 
                          type: Type.STRING, 
                          description: 'The estimated budget or specification.' 
                        },
                        stylePreferences: { 
                          type: Type.STRING, 
                          description: 'Style profile (e.g., Organic Minimalist, Classical Rustics, Solid French Oak, etc.).' 
                        },
                        dateTime: { 
                          type: Type.STRING, 
                          description: 'The requested appointment start time in ISO 8601 format (e.g., "2026-06-25T14:30:00"). Ensure it is programmed during typical South African business hours (09:00 - 17:00).' 
                        },
                        clientName: {
                          type: Type.STRING,
                          description: 'Client name.'
                        },
                        clientEmail: {
                          type: Type.STRING,
                          description: 'Client email to receive the Google Calendar invitation.'
                        }
                      },
                      required: ['projectType', 'dateTime', 'clientName', 'clientEmail']
                    }
                  }
                ]
              }
            ]
          }
        });
      }

      const candidate = response.candidates?.[0];
      const modelText = candidate?.content?.parts?.find((p: any) => p.text)?.text || "";
      const functionCalls = candidate?.content?.parts?.find((p: any) => p.functionCall);

      return res.json({
        content: modelText,
        functionCall: functionCalls ? {
          name: functionCalls.functionCall.name,
          args: functionCalls.functionCall.args
        } : null
      });

    } catch (err: any) {
      console.error("Chat API error:", err);
      return res.status(500).json({ error: err.message || "Failed to process chat consultation." });
    }
  });

  // API Route: ElevenLabs Text-to-Speech
  app.post('/api/tts', async (req, res) => {
    try {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        return res.status(401).json({ error: "ELEVENLABS_API_KEY is not configured on this environment. Please configure it in your Settings/secrets." });
      }

      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text content is required for TTS conversion" });
      }

      // Standard warm female voice id 'Rachel': 21m00Tcm4TlvDq8ikWAM
      const voiceId = "21m00Tcm4TlvDq8ikWAM";
      const modelId = "eleven_multilingual_v2";

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          "accept": "audio/mpeg"
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ElevenLabs API failure response:", errorText);
        return res.status(response.status).json({ error: `ElevenLabs returned an error: ${errorText}` });
      }

      // Read output stream as an ArrayBuffer and return it to the client as audio/mpeg
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', buffer.length);
      return res.end(buffer);

    } catch (err: any) {
      console.error("TTS API error:", err);
      return res.status(500).json({ error: err.message || "An error occurred during Text-to-Speech translation." });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
