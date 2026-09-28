import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { GoogleGenAI } from '@google/genai';
import { handleCors } from './lib/cors';
import { GEMINI_MODEL, RAJDEEP_AI_SYSTEM_INSTRUCTION } from './lib/geminiConfig';

interface IncomingChatMessage {
  sender?: string;
  role?: string;
  text?: string;
}

export default async function handler(req: any, res: any) {
  // 1. CORS check
  const corsOk = handleCors(req, res);
  if (!corsOk) {
    return;
  }

  // 2. HTTP Method restriction
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only POST requests are supported.',
    });
  }

  try {
    // 3. Parse and validate payload
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const rawMessage = body.message;

    if (!rawMessage || typeof rawMessage !== 'string' || rawMessage.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a non-empty message.',
      });
    }

    const trimmedMessage = rawMessage.trim();
    if (trimmedMessage.length > 1500) {
      return res.status(400).json({
        success: false,
        error: 'Message exceeds the maximum length limit of 1500 characters.',
      });
    }

    // Remove debugCode from missing key check
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[ChatAPI] GEMINI_API_KEY is not configured in the server environment.');
      return res.status(500).json({
        success: false,
        error: "Sorry, I'm unable to respond right now. Please try again or contact Rajdeep Enterprises directly.",
      });
    }

    // 5. Build conversation turns for multi-turn context
    const conversationHistory: IncomingChatMessage[] = Array.isArray(body.conversation)
      ? body.conversation.slice(-10) // Limit to the last 10 messages for token safety
      : [];

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    for (const item of conversationHistory) {
      if (!item || typeof item.text !== 'string' || !item.text.trim()) {
        continue;
      }

      // Map sender/role to Gemini's expected 'user' or 'model'
      const isUser = item.sender === 'user' || item.role === 'user';
      const role: 'user' | 'model' = isUser ? 'user' : 'model';

      // Gemini conversation history MUST begin with a 'user' turn
      if (contents.length === 0 && role === 'model') {
        continue;
      }

      const textChunk = item.text.trim().slice(0, 2000);
      contents.push({
        role,
        parts: [{ text: textChunk }],
      });
    }

    // Append the current user message turn
    contents.push({
      role: 'user',
      parts: [{ text: trimmedMessage }],
    });

    // 6. Initialize Gemini SDK
    const ai = new GoogleGenAI({
      apiKey,
    });

    // 7. Generate response from Gemini
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: RAJDEEP_AI_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text?.trim() || "I apologize, but I could not generate a response. Please contact Rajdeep Enterprises directly.";

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error: any) {
    // Log technical detail server-side only; never expose internal stacks or keys
    console.error('[ChatAPI] Error processing chat request:', error?.message || error);

    return res.status(500).json({
      success: false,
      error: "Sorry, I'm unable to respond right now. Please try again or contact Rajdeep Enterprises directly.",
    });
  }
}
