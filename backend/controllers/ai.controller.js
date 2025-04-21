import { chatSession, GenAiCode } from "../configs/AiModel.js";
import Prompt from "../data/Prompt.js";


export const aiChatGen = async (req, res) => {
    try {
        const { prompt } = req.body
        const resp = await chatSession.sendMessage(prompt+Prompt.CHAT_PROMPT);
        const result = resp.response.text();
        return res.status(200).json({
            message: "Ai chat response",
            success: true,
            result,
        })
    } catch (error) {
        console.log("Gemini chat response error: ",error);
        return res.status(503).json({
            message:"Gemini chat response error",
            success: false,
            geminiError: true,
        })
    }
}

export const aiCodeGen = async(req, res) =>{
    try {
        const { prompt } = req.body
        const resp = await GenAiCode.sendMessage(prompt+Prompt.CODE_GEN_PROMPT);
        const result = resp.response.text();
        
        // Sanitize the string by removing control characters before parsing
        const sanitizedResult = result.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

        return res.status(200).json({
            message: "Ai code response", 
            success: true,
            result: JSON.parse(sanitizedResult)
        })
    } catch (error) {
        console.log("Gemini code response error: ", error);
        return res.status(503).json({
            message:"Gemini code response error",
            success: false,
            geminiError: true,
            error: error.message
        })
    }
}

export const aiPromptEnhance = async(req, res) =>{
    try {
        const { prompt } = req.body
        const resp = await chatSession.sendMessage(prompt+Prompt.ENHANCE_PROMPT);
        const result = resp.response.text();
        
        return res.status(200).json({
            message: "Ai prompt enhance response",
            success: true,
            result,
        })
    } catch (error) {
        console.log("Gemini prompt enhance response error: ", error);
        return res.status(503).json({
            message:"Gemini prompt enhance response error",
            success: false,
            geminiError: true,
        })
    }
}