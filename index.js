import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const STATIC_PATH = 'public';


//Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(STATIC_PATH));

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});
//1:49:28


app.post('/api/chat', async (req, res) => {
  const {Message} = req.body;

  if (!Message) {
    return res.status(400).json({ reply: 'Message is required' });
  }
  try {
    const result = await genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: Message,
    });
    const text = result.text;
    return res.status(200).json({ reply: text });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


app.listen(port, () => {
  console.log(`Gemini Chatbot running on http://localhost:${port}`);
});
