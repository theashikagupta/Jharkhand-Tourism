// Node.js Express backend for Jharkhand Tourism chatbot using Google Gemini

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // If using Node 18+, you can use global fetch

const GEMINI_API_KEY = ''; // <-- Your Gemini API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = 'You are a helpful assistant for Jharkhand Tourism. Answer questions about travel, destinations, culture, and booking in Jharkhand.';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ reply: "Message required." });
  }

  try {
    const payload = {
      contents: [
        { parts: [{ text: SYSTEM_PROMPT }] },
        { parts: [{ text: userMessage }] }
      ]
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Gemini API error'); // <-- FIXED LINE
    const data = await response.json();
    const reply = data.candidates &&
                  data.candidates[0] &&
                  data.candidates[0].content &&
                  data.candidates[0].content.parts &&
                  data.candidates[0].content.parts[0].text
      ? data.candidates[0].content.parts[0].text.trim()
      : "Sorry, I’m having trouble answering right now.";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: "Sorry, I’m having trouble answering right now." });
  }
});

app.listen(3000, () => {
  console.log('Chatbot backend listening on port 3000');
});