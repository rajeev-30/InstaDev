"use client"
import { MessageContext } from '@/context/MessageContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import Colors from '@/data/Colors';
import { useConvex } from 'convex/react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, {useContext, useEffect } from 'react'

const ChatView = () => {
    const {id} = useParams();
    const convex =useConvex();
    const {messages, setMessages} = useContext(MessageContext);
    const {userDetails, setUserDetails} = useContext(UserDetailContext);

    useEffect(()=>{
        id&&GetWorspaceData();
    },[id])

    //Used to get workspace data using workspace id
    const GetWorspaceData=async()=>{
        const result=await convex.query(api.workspace.GetWorkspace, {
            workspaceId:id,
        });
        setMessages(result?.messages);
        console.log(result);
    }

    return (
        <div>
            <div>
                {/* {messages?.map((msg,index)=>{
                    <div key={index}>
                        <h2>{msg.content}</h2>
                        <h1>hii</h1>
                    </div>
                })} */}

                {
                    <div style={{backgroundColor:Colors.BACKGRAOUND}}
                        className='p-3 rounded-lg mb-2 flex gap-2 items-start'>
                        {messages[0]?.role=='user' && <Image src={userDetails?.picture} width={30} height={30} className='rounded-full' alt="UserImage"/>}
                        <h2>{messages[0]?.content}</h2>
                    </div>

                }

            </div>
        </div>
    )
}

export default ChatView