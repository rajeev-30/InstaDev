import { USER_API_END_POINT } from "@/Utils/Constant";
import axios from "axios"
import { toast } from "sonner"


export const updateTokens = async (tokens) => {
    try {
        const res = await axios.post(`${USER_API_END_POINT}/update/tokens`, {
            tokens
        }, { withCredentials: true })
        return res.data;
    } catch (error) {
        toast.error("Error updating tokens");
        throw error;
    }
}