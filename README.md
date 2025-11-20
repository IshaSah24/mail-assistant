# Personal AI Mail Assistant — Backend App

This repository contains the complete setup for the Personal AI Mail Assistant, including:
- A Chrome Extension for Gmail
    -   Reads the mail and generates  the response based on the tone/mode you choose 
    -   conatins modes/tones  like : friendly,  proffesionally, friendly to  generate the response
- A React Frontend (optional UI/testing)
- A Local AI-powered Backend using Together API / HuggingFace

The  extention will be  published by the  end of 2025
Called - Mail Ai Writer.

# Project Structure
MAIL-ASSISTANT/
│
├── Backend/
│   ├── controllers/
│   │   └── createEmailResponse.js
│   ├── dao/
│   ├── middlewares/
│   ├── routes/
│   │   └── emailRoutes.js
│   ├── utils/
│   │   └── togetherApi.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
└── gmail-ai-extension/
    ├── manifest.json
    ├── content.js
    ├── content2.js
    ├── toneMenu.js
    └── styles/
        ├── toneMenu.css
        └── content.css

# Backend (Local Only)
The backend processes prompts from the extension and uses Together API / HuggingFace models for email rewriting, replying, summarizing, etc.

## Setup
cd Backend
npm install

## Create .env
TOGETHER_API_KEY=your_together_api_key
HF_API_KEY=your_huggingface_api_key
MODEL_NAME= "your_model_name"
PORT=5000


## Run backend
npm run dev

Backend URL:
http://localhost:5000

# Backend API
POST /api/prompt

Request:
{
  "prompt": "Write a professional reply."
}

Response:
{
  "success": true,
  "output": "Generated text..."
}

Errors also return JSON.

# Frontend (Optional)
React + Vite app used for testing or future UI.

## Run
cd Frontend
npm install
npm run dev

Frontend is optional and not required for the extension to run.

# Chrome Extension
Folder: gmail-ai-extension/

Includes:
- manifest.json
- content.js
- content2.js
- toneMenu.js
- styles/

## Load in Chrome
1. Go to chrome://extensions
2. Enable Developer Mode
3. Load Unpacked → select `gmail-ai-extension`

How it works:
- Gmail page loads extension scripts.
- User selects text / types email.
- Extension sends a prompt to backend.
- Backend returns AI-generated message.
- Extension inserts response back into Gmail.

# Troubleshooting
- Backend must be running for extension to work.
- Port in manifest/config must match backend.
- Check .env if model or API errors occur.
- Ensure Together/HF API keys are valid.

# Contributing
- Keep changes modular.
- Update README if backend routes or env variables change.
- Do not push .env.


This project is for personal use only. Not licensed for redistribution.

