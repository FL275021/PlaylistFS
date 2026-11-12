import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

const iaModel = apiKey
  ? new GoogleGenerativeAI(apiKey).getGenerativeModel({
      model: 'gemini-3.5-flash-lite',
      systemInstruction: {
        role: 'system',
        parts: [
          {
            text: 'Eres un experto en música. Tu única función es generar descripciones cortas y atractivas para playlists. Devuelve solo la descripción, sin introducciones ni despedidas.',
          },
        ],
      },
    })
  : null;

export default iaModel;
