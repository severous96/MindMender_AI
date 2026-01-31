
import { GoogleGenAI } from "@google/genai";

export const getGeminiResponse = async (history: { role: string; content: string }[], userPrompt: string) => {
  try {
    // apiKey is expected from process.env.API_KEY.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prepare conversation history
    const contents = [
      ...history.map(h => ({
        role: h.role === 'ai' ? 'model' : 'user',
        parts: [{ text: h.content }]
      })),
      { role: 'user', parts: [{ text: userPrompt }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction: `You are MindMenders AI, a sophisticated, deeply empathetic, and supportive mental health companion. 
        Your goal is to provide warm, professional emotional support.
        
        Guidelines:
        1. Always be patient and validate the user's feelings.
        2. If relevant, suggest calming exercises like Box Breathing or Grounding.
        3. Identity: You are MindMenders AI.
        4. Safety: If you detect self-harm or severe crisis, provide resources (like 988 in the US) and encourage professional help immediately.`,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    // Access text property directly
    const outputText = response.text;
    
    if (!outputText) {
      throw new Error("No text output received from Gemini.");
    }

    return outputText;
  } catch (error) {
    console.error("Gemini AI error details:", error);
    return "I'm sorry, I'm having a hard time connecting to my thoughts right now. I'm still here with you, though. Please take a moment to breathe with me. What else is on your mind?";
  }
};
