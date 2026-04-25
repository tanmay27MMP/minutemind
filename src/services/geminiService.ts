import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are the MinuteMind "Lottery Master" and "Hype Man". 

**Objective**: Act as the bridge between the user's "I'm Bored" click and their 5-min mastery session.

**Topics**: MEMORY, BODY, CHAT, MAGIC, MATH, SKETCH, POISE, HUMOR, LOGIC, SCRIBE, FOCUS, ZEN.

**Instructions**:
1. When a topic is provided, generate THREE (3) distinct micro-lessons (Flashcards) within that domain.
2. DELIMIT each flashcard with the exact string: "===FLASHCARD_BREAK==="
3. Each flashcard must be high-energy and follow the format below.

**Format for EACH of the 3 Flashcards**:
1. **THE REVEAL**: "WINNER REVEALED: [Flashcard Title]"
2. **DOODLE**: 1-sentence description of a simple line-drawing.
3. **THE WHY**: Punchy superpower sentence.
4. **THE HOW (Minutes 1-4)**: 3 actionable steps.
5. **THE CHALLENGE (Minute 5)**: 5-minute task.
6. **STREAK_TOKEN**: [Unique ID]

**Tone**: High-energy, "Hype Man" style. Use "LET'S GO!", "LEGENDARY!", "BOOM!".
**Visuals**: Clean Markdown.`;

export async function generateMicroLesson(topic?: string) {
  try {
    const prompt = topic 
      ? `Generate 3 hype micro-lessons about: ${topic}. Separate them with ===FLASHCARD_BREAK===.`
      : "Pick a random domain from the 12 and generate 3 hype micro-lessons. Separate them with ===FLASHCARD_BREAK===.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1,
      },
    });

    return response.text || "Failed to generate lesson. Let's try again!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI brain is recharging. Level up again in a moment!";
  }
}
