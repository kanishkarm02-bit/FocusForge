import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export async function generateQuiz(topic: string): Promise<QuizQuestion[]> {
  const gemini = getGemini();
  
  const response = await gemini.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Generate a 3-question multiple choice quiz about "${topic}" to reinforce learning. Make it engaging and educational.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "The quiz question.",
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4 possible answers.",
            },
            correctAnswerIndex: {
              type: Type.INTEGER,
              description: "The index (0-3) of the correct answer in the options array.",
            },
            explanation: {
              type: Type.STRING,
              description: "A brief explanation of why the answer is correct.",
            },
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"],
        },
      },
    },
  });

  const jsonStr = response.text?.trim() || "[]";
  try {
    return JSON.parse(jsonStr) as QuizQuestion[];
  } catch (e) {
    console.error("Failed to parse quiz JSON", e);
    return [];
  }
}
