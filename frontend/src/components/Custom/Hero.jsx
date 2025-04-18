import { Colors } from '@/data/Colors'
import Lookup from '@/data/Lookup'
import { ArrowRight, ArrowRightCircle, MessageCircle, SidebarOpen } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import LoginDialog from '../Auth/LoginDialog'
import { useDispatch, useSelector } from 'react-redux'
import { getSigninDialog } from '@/redux/userSlice'
import axios from 'axios'
import { WORKSPACE_API_END_POINT } from '@/Utils/Constant'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AppSideBar from './AppSideBar'


const Hero = () => {
    const [input, setInput] = useState("")
    const { user, userImage } = useSelector(store => store.user)
    const { messages, userWorkspaces } = useSelector(store => store.workspace)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
                onGenerate(input);
            }
        }
    };

    const onGenerate = async (input) => {
        try {
            if (!user) {
                dispatch(getSigninDialog(true));
            }
            if (user?.tokens < 10) {
                toast("You don't have enough tokens! Upgrad to Premium");
                return;
            }
            const message = {
                role: 'user',
                content: input
            }
            const res = await axios.post(`${WORKSPACE_API_END_POINT}/create`, {
                message
            }, { withCredentials: true })

            // dispatch(getMessages(res.data.workspace.messages))
            // console.log("first message: ", message)
            navigate('workspace/' + res.data.workspace._id)
        } catch (error) {

        }
    }


    return (
        <div className='w-full'>
            <div className='flex flex-col gap-3 items-center justify-center mt-46'>
                <h2 className='font-bold text-5xl'>{Lookup.HERO_HEADING}</h2>
                <p className='text-gray-400'>{Lookup.HERO_DESC}</p>
                <div className='p-4 border border-gray-800 rounded-md max-w-lg w-full mt-3'
                    style={{ backgroundColor: Colors.BACKGRAOUND }}>
                    <div className='flex justify-between gap-2'>
                        <textarea
                            className='w-full outline-none resize-none bg-transparent h-26 max-h-32 '
                            placeholder={Lookup.INPUT_PLACEHOLDER}
                            value={input}
                            type="text"
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setInput(e.target.value)} />
                        {
                            input &&
                            <ArrowRight
                                onClick={() => onGenerate(input)}
                                className='bg-blue-500 p-2 h-8 w-10 rounded-md cursor-pointer' />
                        }
                    </div>
                </div>

                <div className='flex flex-wrap max-w-2xl mt-10 gap-3 justify-center'>
                    {
                        Lookup.SUGGSTIONS.map((item, index) =>
                            <div
                                onClick={() => onGenerate(item)}
                                className='border-1 border-gray-800 px-3 py-1 rounded-full text-xs text-gray-400 hover:text-white cursor-pointer hover:bg-gray-600/25' key={index}>
                                {item}
                            </div>
                        )
                    }
                </div>
            </div>

            
            {user && <AppSideBar/>}
            <LoginDialog />
            
        </div>
    )
}

export default Hero