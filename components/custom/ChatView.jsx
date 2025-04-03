"use client"
import { MessageContext } from '@/context/MessageContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
// import Markdown from 'react-markdown'

const ChatView = () => {
    const { id } = useParams();
    const convex = useConvex();
    const { messages, setMessages } = useContext(MessageContext);
    const {userDetails, setUserDetails } = useContext(UserDetailContext);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const UpdateMessages = useMutation(api.workspace.UpdateMessages);

    useEffect(() => {
        id && GetWorspaceData();
    }, [id])

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role == 'user') {
                GetAiResponse();
            }
        }
        console.log(messages)
    }, [messages])

    //Used to get workspace data using workspace id

    const GetWorspaceData = async () => {
        setLoading(true)
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id,
        });
        setMessages(result?.messages);
        setLoading(false)
        console.log(result);
    }

    const GetAiResponse = async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
        const res = await axios.post('/api/ai-chat', {
            prompt: PROMPT,
        })

        console.log(res.data.result);
        const aiRes = {
            role: 'ai',
            content: res.data.result
        }
        setMessages(prev=>[...prev, aiRes])
        await UpdateMessages({ workspaceId: id, messages: [...messages, aiRes] })
        setLoading(false);
    }

    const onGenerate = async (input) => {
        setMessages(prev=>[...prev, {
            role:'user',
            content:input
        }])
        setUserInput("");
    }
    return (
        <div className='relative h-[88vh] flex flex-col'>
            <div className='flex-1 overflow-y-scroll scrollbar-hide'>

                {messages && messages?.map((msg, index) => (
                    <div key={index} style={{ backgroundColor: Colors.BACKGRAOUND }}
                    className='p-3 rounded-lg mb-3 flex gap-2 items-center leading-7'>
                        {msg?.role == 'user' && <Image src={userDetails?.picture} width={30} height={30} className='rounded-full' alt="UserImage" />}

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
            <div className='p-5 border rounded-xl max-w-2xl w-full mt-3'
                style={{ backgroundColor: Colors.BACKGRAOUND }}>
                <div className='flex justify-between gap-2'>
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        // onKeyDown={handleKeyDown}
                        type="text"
                        placeholder={Lookup.INPUT_PLACEHOLDER}
                        className='outline-none resize-none bg-transparent w-full h-32 max-h-52'
                    />
                    {userInput &&
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
    )
}

export default ChatView