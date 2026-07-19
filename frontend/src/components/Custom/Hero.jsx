import { Colors } from '@/data/Colors'
import Lookup from '@/data/Lookup'
import { ArrowRight, ArrowRightCircle, ChevronDown, Loader2Icon, MessageCircle, RefreshCcw, SidebarOpen } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import LoginDialog from '../Auth/LoginDialog'
import { useDispatch, useSelector } from 'react-redux'
import { getSigninDialog } from '@/redux/userSlice'
import axios from 'axios'
import { AI_API_END_POINT, DEFAULT_MODEL, WORKSPACE_API_END_POINT } from '@/Utils/Constant'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AppSideBar from './AppSideBar'
import TooltipText from './TooltipText'
import { useQuery } from '@tanstack/react-query'
import { getModels } from '@/lib/api/model'
import { setSelectedModel } from '@/redux/workspaceSlice'



const Hero = () => {
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const { user } = useSelector(store => store.user)
    const { selectedModel } = useSelector(store => store.workspace)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const ref = useRef(null)

    const { data } = useQuery({
        queryKey: ['models'],
        queryFn: getModels,
    });

    const allModels = data?.models || [];

    useEffect(() => {
        if (!selectedModel && allModels?.length > 0) {
            dispatch(setSelectedModel(DEFAULT_MODEL));
        }
    }, [allModels, dispatch, selectedModel]);

    
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
                return;
            }
            if (user?.tokens < 10) {
                toast("You don't have enough tokens! Upgrade to Premium");
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
            navigate('workspace/' + res.data.workspace._id)
        } catch (error) {
            toast("Something went wrong! Please try again later.");
            navigate('/')
        }
    }

    const handleHeight = () => {
        ref.current.style.height = 'auto';
        ref.current.style.height = `${Math.min(ref.current.scrollHeight, 224)}px`;
    }

    useEffect(() => {
        handleHeight();
    }, [input]);

    return (
        <div className='w-full'>
            <div className='flex flex-col gap-3 items-center justify-center mt-46'>
                <h2 className='font-bold text-5xl'>{Lookup.HERO_HEADING}</h2>
                <p className='text-gray-400'>{Lookup.HERO_DESC}</p>
                <div className='px-4 pb-1 border border-gray-800 rounded-md max-w-lg w-full mt-3'
                    style={{ backgroundColor: Colors.BACKGRAOUND }}>
                    <div className='py-2 flex justify-between gap-2'>
                        <textarea
                            ref={ref}
                            className='text-[14px] w-full outline-none resize-none bg-transparent min-h-28 max-h-56'
                            placeholder={Lookup.INPUT_PLACEHOLDER}
                            value={input}
                            type="text"
                            onKeyDown={handleKeyDown}
                            onChange={(e) => {
                                setInput(e.target?.value);
                            }}
                        />
                        {/* <ReactMarkdown>{input}</ReactMarkdown> */}
                        {
                            input &&
                            <ArrowRight
                                onClick={() => onGenerate(input)}
                                className='bg-blue-500 p-2 h-8 w-10 rounded-md cursor-pointer' />
                        }
                    </div>

                    <div className='flex items-center justify-between gap-2'>
                        {/* ToopTip Text  */}
                        <div className='pt-3'>
                            <TooltipText input={input} setInput={setInput} loading={loading} setLoading={setLoading} />
                        </div>

                        <div>
                            {
                                allModels?.length > 0 &&
                                <div className='relative inline-flex items-center shrink-0'>
                                    <select
                                        value={selectedModel}
                                        onChange={(e) => {
                                            dispatch(setSelectedModel(e.target.value));
                                        }}
                                        className='appearance-none bg-transparent pr-5 pl-1 text-right text-white outline-none max-w-75'
                                    >
                                        {allModels.map((model) => (
                                            <option key={model.slug} value={model.slug}>
                                                {model.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className='pointer-events-none absolute right-0 h-4 w-4 text-gray-400' />
                                </div>
                            }
                        </div>   
                    </div> 

                </div>

                <div className='flex flex-wrap max-w-2xl mt-10 gap-3 justify-center'>
                    {
                        Lookup.SUGGSTIONS.map((item, index) =>
                            <div
                                onClick={() => onGenerate(item)}
                                className='border border-gray-800 px-3 py-1 rounded-full text-xs text-gray-400 hover:text-white cursor-pointer hover:bg-gray-600/25' key={index}>
                                {item}
                            </div>
                        )
                    }
                </div>
            </div>


            {user && <AppSideBar />}
            <LoginDialog />
            
        </div>
    )
}

export default Hero