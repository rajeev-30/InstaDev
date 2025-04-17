import { store } from '@/redux/store'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown';
import { Colors } from '@/data/Colors';
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import Lookup from '@/data/Lookup';
import axios from 'axios';
import { AI_API_END_POINT, USER_API_END_POINT, WORKSPACE_API_END_POINT } from '@/Utils/Constant';
import { useNavigate, useParams } from 'react-router-dom';
import { getRefresh as getWorkspaceRefresh } from '@/redux/workspaceSlice';
import { getRefresh as getUserRefresh } from '@/redux/userSlice';
import Prompt from '@/data/Prompt';
import { toast } from 'sonner';
import AppSideBar, { Avatar } from './AppSideBar';

const ChatView = () => {
    const {messages} = useSelector(store=>store.workspace)
    const {user} = useSelector(store=>store.user)
    const [userInput, setUserInput] = useState("")
    const [loading, setLoading] = useState(false)
    const params = useParams();
    const { id } = params;
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const countTonken = (inputText) =>{
        return inputText.trim().split(/\s+/).filter(word => word).length;
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (userInput.trim()) {
                onGenerate(userInput);
            }
        }
    };

    useEffect(() => {
        if(!messages) setLoading(true)
        else setLoading(false)

        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role == 'user') {
                GetAiResponse();
            }
        }
        // console.log(messages)
    }, [messages])


    const GetAiResponse = async () =>{
        try {
            setLoading(true);
            const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
            const res = await axios.post(`${AI_API_END_POINT}/chat`, {
                prompt: PROMPT,
            }, {withCredentials: true})

            // console.log(res.data.result);
            const aiRes = {
                role: 'model',
                content: res.data.result
            }

            await axios.post(`${WORKSPACE_API_END_POINT}/update/messages/${id}`, 
                {message: aiRes}, 
                {withCredentials: true}
            )

            const tokens = Number(user?.tokens)-Number(countTonken(JSON.stringify(aiRes)))
            await axios.post(`${USER_API_END_POINT}/update/tokens/`, {tokens}, {withCredentials: true})

            dispatch(getUserRefresh())
            dispatch(getWorkspaceRefresh())
            setLoading(false);

        } catch (error) {
            console.log("AI Chat response error: ", error);
            toast("Something went wrong!");
            navigate('/')
        }
    }


    const onGenerate = async() =>{
        if(user?.tokens<10) {
            toast("You don't have enough tokens! Upgrad to Premium");
            return;
        }
        const message = {
            role:'user',
            content: userInput
        }
        try {
            await axios.post(`${WORKSPACE_API_END_POINT}/update/messages/${id}`, 
                {message}, 
                {withCredentials: true}
            )
            dispatch(getWorkspaceRefresh())
            setUserInput("")
        } catch (error) {
            console.log("Update message error: ", error);
        }
    }

    return (
        <div className='relative h-[90vh] flex flex-col'>
            
            <div className='flex-1 overflow-y-scroll scrollbar-hide '>

                {messages && messages?.map((msg, index) => (
                    <div key={index} style={{ backgroundColor: Colors.BACKGRAOUND }}
                    className='p-3 rounded-lg mb-3 flex gap-2 items-center leading-7'>
                        {/* {msg?.role == 'user' && <img src={user?.picture} width={30} height={30} className='rounded-full'/>} */}
                        {msg?.role == 'user' && <Avatar name={user.name} />}

                        <div className="flex flex-col gap-5">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}

                { loading && 
                    <div style={{ backgroundColor: Colors.BACKGRAOUND }} className='p-3 rounded-lg mb-2 flex gap-2 items-start'>
                        <Loader2Icon className='animate-spin h-5 w-5' />
                        <h2>Cooking...</h2>
                    </div>
                }
            </div>

            {/* Input section  */}
            <div className='flex gap-6 items-end'>
                <div className='-ml-6 flex'>
                {user && <AppSideBar/>}
                    {/* {user && <img src={user?.picture} width={30} height={30}  className='rounded-full cursor-pointer' alt="UserImage" onClick={openDrawer} />} */}
                </div>
                <div className='p-5 border border-gray-600 rounded-xl max-w-2xl w-full mt-3'
                    style={{ backgroundColor: Colors.BACKGRAOUND }}>
                    <div className='flex justify-between gap-2'>
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            type="text"
                            placeholder={Lookup.INPUT_PLACEHOLDER}
                            className='outline-none resize-none bg-transparent w-full h-32 max-h-52'
                        />
                        {userInput.trim() &&
                            <ArrowRight
                                onClick={() => onGenerate(userInput)}
                                className='bg-blue-500 p-2 h-8 w-8 rounded-md cursor-pointer' />
                        }
                    </div>
                    <div>
                        <Link className='h-5 w-5 cursor-pointer' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatView