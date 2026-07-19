import { chatSession, GenAiCode } from "../configs/AiModel.js";
import Prompt from "../data/Prompt.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();


export const aiChatGen = async (req, res) => {
    try {
        const { prompt, model, stream } = req.body
        const oneapi_key = process.env.ONEAPI_API_KEY;
        const oneapi_endpoint = process.env.ONEAPI_CHAT_COMPLETION_ENDPOINT;
        if(!oneapi_endpoint) {
            return res.status(500).json({
                message: "OneAPI endpoint is not configured",
                success: false,
            })
        }
        if(!oneapi_key) {
            return res.status(500).json({
                message: "OneAPI key is not configured",
                success: false,
            })
        }

        const data = {
            model,
            messages: [
                { role: "user", content: prompt+Prompt.CHAT_PROMPT }
            ],
            stream: false
        };
        const resp = await axios.post(oneapi_endpoint, data, {
            headers: {
                Authorization: `Bearer ${oneapi_key}`,
                "Content-Type": "application/json"
            }
        });

        if(stream){
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            resp.data.on('data', (chunk) => {
                const data = chunk.toString();
                if (data === '[DONE]') {
                    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
                    res.end();
                } else {
                    try {
                        const parsedData = JSON.parse(data);
                        const content = parsedData.choices[0].message.content;
                        res.write(`data: ${JSON.stringify({ content })}\n\n`);
                    } catch (err) {
                        console.error("Error parsing stream data: ", err);
                    }
                }
            });

            resp.data.on('error', (err) => {
                console.error("Stream error: ", err);
                res.end();
            });

            return;
        }

        const result = resp.data.data.choices[0].message.content;
        return res.status(200).json({
            message: "Ai chat response",
            success: true,
            tokens: resp?.data?.data?.usage?.total_tokens,
            result,
        })
    } catch (error) {
        return res.status(503).json({
            message: error?.response?.data?.message || "An error occurred! Please try again later.",
            success: false,
            error: error?.response?.data || error.message
        })
    }
}

export const aiCodeGen = async(req, res) =>{
    try {
        const { prompt, model } = req.body
        const oneapi_key = process.env.ONEAPI_API_KEY;
        const oneapi_endpoint = process.env.ONEAPI_CHAT_COMPLETION_ENDPOINT;
        if(!oneapi_endpoint) {
            return res.status(500).json({
                message: "OneAPI endpoint is not configured",
                success: false,
            })
        }
        if(!oneapi_key) {
            return res.status(500).json({
                message: "OneAPI key is not configured",
                success: false,
            })
        }

        const data = {
            model,
            messages: [
                { role: "user", content: prompt+Prompt.CODE_GEN_PROMPT }
            ],
            stream: false
        };
        const resp = await axios.post(oneapi_endpoint, data,  {
            headers: {
                Authorization: `Bearer ${oneapi_key}`,
                "Content-Type": "application/json"
            }
        });
        const result = resp.data.data.choices[0].message.content;

        
        // Sanitize the string by removing control characters before parsing
        // const sanitizedResult = result.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

        return res.status(200).json({
            message: "Ai code response", 
            success: true,
            tokens: resp?.data?.data?.usage?.total_tokens,
            result
        })
    } catch (error) {
        return res.status(503).json({
            message: error?.response?.data?.message || "An error occurred! Please try again later.",
            success: false,
            error: error?.respose?.data || error?.message
        })
    }
}

export const aiPromptEnhance = async(req, res) =>{
    try {
        const { prompt, model } = req.body
        const oneapi_key = process.env.ONEAPI_API_KEY;
        const oneapi_endpoint = process.env.ONEAPI_CHAT_COMPLETION_ENDPOINT;
        if(!oneapi_endpoint) {
            return res.status(500).json({
                message: "OneAPI endpoint is not configured",
                success: false,
            })
        }
        if(!oneapi_key) {
            return res.status(500).json({
                message: "OneAPI key is not configured",
                success: false,
            })
        }

        const data = {
            model,
            messages: [
                { role: "user", content: prompt+Prompt.ENHANCE_PROMPT }
            ],
            stream: false
        };
        const resp = await axios.post(oneapi_endpoint, data,  {
            headers: {
                Authorization: `Bearer ${oneapi_key}`,
                "Content-Type": "application/json"
            }
        });

        const result = resp.data.data.choices[0].message.content;
        
        return res.status(200).json({
            message: "Ai prompt enhance response",
            success: true,
            tokens: resp?.data?.data?.usage?.total_tokens,
            result,
        })
    } catch (error) {
        return res.status(503).json({
            message:error?.response?.data?.message || "An error occurred! Please try again later.",
            success: false,
            error: error?.response?.data || error.message
        })
    }
}

export const getModels = async(req, res) => {
    try {
        const oneapi_backend_endpoint = process.env.ONEAPI_BACKEND_ENDPOINT;
        if(!oneapi_backend_endpoint) {
            return res.status(500).json({
                message: "OneAPI backend endpoint is not configured",
                success: false,
            })
        }
        const resp = await axios.get(`${oneapi_backend_endpoint}/model`, {
            params: { page: 1, page_size: "all" },
            headers: {
                "Content-Type": "application/json"
            }
        });
        const models = resp.data.data;
        return res.status(200).json({
            message: "Models retrieved successfully",
            success: true,
            models
        })
    } catch (error) {
        console.error("Error retrieving models:", error?.response?.data);
        return res.status(503).json({
            message: error?.response?.data?.message || "Error retrieving models",
            success: false,
            error: error?.response?.data || error.message
        })
    }
}