import express, { response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { genAI, generationConfig, safetySettings } from "../index.js";

dotenv.config();

const router = express.Router();
async function chat(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.0-pro",
    });
    const result = await model.generateContent(prompt);
    // console.log("result:", result);
    const response = await result.response;
    // console.log("response:", response);
    const text = response.text();
    console.log("text:", text);
    return text;
  } catch (err) {
    console.log(JSON.stringify(err));
    return err;
  }
}

router.post("/text", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;
    const response = await chat("do not give any code just chat: " + text);

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
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error });
  }
});

router.post("/code", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;

    const response = await chat(
      "only reply with code no explaination: " + text
    );

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

    // res.status(200).json({ text: response.data.choices[0].message.content });
    res.status(200).json({ text: response });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error });
  }
});

router.post("/assist", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await chat(text);

    // res.status(200).json({ text: response.data.choices[0].message.content });
    res.status(200).json({ text: response });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
