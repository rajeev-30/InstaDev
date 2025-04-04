"use client"
import { MessageContext } from '@/context/MessageContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import Colors from '@/data/Colors'
import Lookup from '@/data/Lookup'
import { ArrowRight, Link } from 'lucide-react'
import React, { use, useContext, useEffect, useState } from 'react'
import SigninDialog from './SigninDialog'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'


const Hero = () => {
    const [input, setInput] = useState("");
    const {messages=[], setMessages} = useContext(MessageContext);
    const {userDetails, setUserDetails} = useContext(UserDetailContext);
    const [openDialog, setOpenDialog] = useState(false);
    const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
    const router = useRouter();


    const handleKeyDown = (event) => {
        if (event.key === "Enter" && input.trim() === "") {
          event.preventDefault(); // Prevents adding a new line
        }
    };

    const onGenerate = async(input)=>{
        if(!userDetails?.name){
            setOpenDialog(true);
            return;
        }
        const msg={
            role: 'user',
            content: input
        }
        setMessages(msg)

        const workspaceId = await CreateWorkspace({
            user:userDetails._id,
            messages:[msg]
        })

        console.log("WorkSpace ID: "+workspaceId);
        router.push('/workspace/'+workspaceId);
    }   

    return (
            <div className='mt-36 ml-64 xl:mt-42 flex flex-col items-center justify-center gap-2'>
                <h2 className='text-4xl font-extrabold '>{Lookup.HERO_HEADING}</h2>
                <p className='text-gray-400 font-medium'>{Lookup.HERO_DESC}</p>
                
                <div className='p-5 border rounded-xl max-w-2xl w-full mt-3'
                style={{backgroundColor: Colors.BACKGRAOUND}}>
                    <div className='flex justify-between gap-2'>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            type="text" 
                            placeholder={Lookup.INPUT_PLACEHOLDER} 
                            className='outline-none resize-none bg-transparent w-full h-32 max-h-52'
                        />
                        {  input && 
                            <ArrowRight
                                onClick={() => onGenerate(input)}
                                className='bg-blue-500 p-2 h-8 w-8 rounded-md cursor-pointer'/>
                        }
                    </div>
                    <div>
                        <Link className='h-5 w-5 cursor-pointer'/>
                    </div>
                </div>

                <div className='flex flex-wrap max-w-2xl mt-4 gap-3 justify-center'>
                    {Lookup?.SUGGSTIONS.map((suggestion, index) => (
                        <div 
                            onClick={() => onGenerate(suggestion)} 
                            key={index} className='p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer'>
                            {suggestion}
                        </div>
                    ))}
                </div>
                <SigninDialog openDialog={openDialog} closeDialog={()=>setOpenDialog(false)}/>
                
            </div>
    )
}

export default Hero