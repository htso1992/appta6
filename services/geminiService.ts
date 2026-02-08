
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateQuizQuestions = async (lessonTitle: string, content: string) => {
  const ai = getAI();
  const prompt = `Generate 5 multiple-choice questions for a Grade 6 English lesson titled "${lessonTitle}". 
  Lesson content: ${content}. 
  Return exactly in JSON format:
  [{ "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0 }]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Generation error:", error);
    return null;
  }
};

export const getLearningTip = async (studentProgress: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on this student progress: "${studentProgress}", give a short encouraging learning tip in Vietnamese for a Grade 6 student.`
  });
  return response.text;
};
