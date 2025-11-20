import dotenv from "dotenv";
dotenv.config();

import { InferenceClient } from "@huggingface/inference"; 

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const client = new InferenceClient(TOGETHER_API_KEY);

const SYSTEM_PROMPT = `You are a helpful AI assistant. Your task is to generate a response based on the user's mail content and tone that  user have provided.

    Tone can be one of the following:
    - Professional
    - Casual
    - Friendly 
    - Neutral

if  the tone is not specified, use a neutral tone.And keep your responses concise and relevant to the topic.
IMPORTANT: Return only the email body text. Do not include "From", "To", or "Subject". `;

export const generateAiResponse = async (mailContent, tone) => {
  try {
    console.log(tone);
    
    const chatCompletion = await client.chatCompletion({
      model: process.env.MODEL_NAME,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Tone: ${tone}\nEmail: ${mailContent}` },
      ],
      provider: "together",
      max_tokens: 60,
    });

    const raw = chatCompletion.choices[0].message.content;

    console.log("Raw AI response:", raw);
    const cleaned = raw
      .split("\n")
      .map((line) => line.trimEnd())
      .filter((line) => line.length > 0)
      .join("\n")
      .trim();

    return cleaned;
  } catch (err) {
    console.error("Together API error:", err.message);
    throw new Error("Failed to generate AI response");
  }
};

process.on("uncaughtException", (err) => {
  console.log("there was  an uncought error", err);
  process.exit(1);
});
