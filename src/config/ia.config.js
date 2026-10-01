import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Falta la variable de entorno GEMINI_API_KEY');
}

const genAI = new GoogleGenerativeAI(apiKey);

const iaModel = genAI.getGenerativeModel({
  model: 'gemini-3.5-flash-lite',
  systemInstruction: {
    role: 'system',
    parts: [
      {
        text: 'Eres un experto en música. Tu única función es generar descripciones cortas y atractivas para playlists. Devuelve solo la descripción, sin introducciones ni despedidas.',
      },
    ],
  },
});

export default iaModel;
