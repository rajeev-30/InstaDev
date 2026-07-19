import axios from "axios";
import { AI_API_END_POINT } from '@/Utils/Constant'
import { toast } from "sonner";



export const getModels = async () => {
    try {
        const res = await axios.get(`${AI_API_END_POINT}/models`, { withCredentials: true });
        return res.data;
    } catch (error) {
        throw error;
    }
};