import { GenAiCode } from "@/configs/AiModel";

export async function POST(req) {
    const { prompt } = await req.json();
    try{
        const result = await GenAiCode.sendMessage(prompt);
        const response = result.response.text();
        return NextResponse.json({result:response});
    }catch(error){
        console.log("Gemini response error: ",error);
    }
}