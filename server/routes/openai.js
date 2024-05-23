import express, { response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

dotenv.config();

const router = express.Router();

const apiKey = process.env.GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  systemInstruction: "You are a helpful assistant,who does not give any code.",
});
const model1 = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  systemInstruction:
    "You are an assistant coder who responds with only code and no explanations.",
});
const model2 = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  systemInstruction:
    "You are a helpful assistant that serves to only complete user's thoughts or sentences.",
});
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

async function chat(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  const text = result.response.text();
  return text;
}
async function code(prompt) {
  const chatSession = model1.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  const text = result.response.text();
  return text;
}
async function assist(prompt) {
  const chatSession = model2.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  const text = result.response.text();
  return text;
}

router.post("/text", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;
    if (text.startsWith("steve")) {
      let result = await text.replace("steve", "");
      console.log("text:", result);
      const response = await chat(result);

      await axios.post(
        `https://api.chatengine.io/chats/${activeChatId}/messages/`,
        { text: response },
        {
          headers: {
            "Project-ID": process.env.PROJECT_ID,
            "User-Name": process.env.BOT_USER_NAME,
            "User-Secret": process.env.BOT_USER_SECRET,
          },
        }
      );

      res.status(200).json({ text: response });
    }
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error });
  }
});
router.post("/code", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;

    if (text.startsWith("steve")) {
      let result = await text.replace("steve", "");
      console.log("text:", result);
      const response = await code(result);

      await axios.post(
        `https://api.chatengine.io/chats/${activeChatId}/messages/`,
        { text: response },
        {
          headers: {
            "Project-ID": process.env.PROJECT_ID,
            "User-Name": process.env.BOT_USER_NAME,
            "User-Secret": process.env.BOT_USER_SECRET,
          },
        }
      );

      res.status(200).json({ text: response });
    }
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error });
  }
});

router.post("/assist", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await assist(text);

    // res.status(200).json({ text: response.data.choices[0].message.content });
    res.status(200).json({ text: response });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
});
export default router;
