import React, { useEffect, useState } from 'react'
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import { nightOwl } from "@codesandbox/sandpack-themes";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { AI_API_END_POINT, USER_API_END_POINT, WORKSPACE_API_END_POINT } from '@/Utils/Constant';
import { useNavigate, useParams } from 'react-router-dom';
import { getRefresh as getWorkspaceRefresh } from '@/redux/workspaceSlice';
import { getRefresh as getUserRefresh } from '@/redux/userSlice';
import { Loader2Icon } from 'lucide-react';
import SandpackPreviewClient from './SandpackPreviewClient';
import { toast } from 'sonner';


const CodeView = () => {
    const { user } = useSelector(store => store.user)
    const { messages, fileData } = useSelector(store => store.workspace)
    const [activeTab, setActiveTab] = useState('code');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const params = useParams();
    const { id } = params;
    const navigate = useNavigate()

    const countTonken = (inputText) => {
        return inputText.trim().split(/\s+/).filter(word => word).length;
    }

    const parseGeneratedResponse = (responseText) => {
        if (!responseText) return null;

        if (typeof responseText === 'object') {
            return responseText;
        }

        const cleanedText = String(responseText)
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```\s*$/i, '')
            .trim();

        try {
            return JSON.parse(cleanedText);
        } catch (parseError) {
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            throw parseError;
        }
    }

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role == 'user') {
                GenerateAiCode();
            }
        }
        // console.log(messages)
    }, [messages])

    const GenerateAiCode = async () => {
        try {
            setLoading(true);
            const PROMPT = JSON.stringify(messages);
            const res = await axios.post(`${AI_API_END_POINT}/code`, {
                prompt: PROMPT,
            }, { withCredentials: true });
            const aiRes = parseGeneratedResponse(res.data.result);

            if (!aiRes?.files) {
                throw new Error('AI response did not include generated files.');
            }

            const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiRes?.files };

            await axios.post(`${WORKSPACE_API_END_POINT}/update/filedata/${id}`, {
                fileData: mergedFiles
            }, { withCredentials: true })

            const tokens = Number(user?.tokens) - Number(res.data.tokens);
            await axios.post(`${USER_API_END_POINT}/update/tokens/`, { tokens }, { withCredentials: true })

            dispatch(getUserRefresh())
            dispatch(getWorkspaceRefresh())

            setActiveTab('code')
        } catch (error) {
            console.log("AI Code response error: ", error);
            toast("Something went wrong! Please try again later.");
            navigate('/')

        }
        finally {
            setLoading(false)
        }
    };


    return (
        <div className="relative">
            <div className="bg-[#181818] w-full p-2  rounded-t-md">
                <div className="flex items-center justify-center flex-wrap shrink-0  bg-black p-1 w-[150px] rounded-full">
                    <h2 className={`text-sm cursor-pointer w-[50%] text-center py-0.5
            ${activeTab === 'code' ? 'text-blue-600  bg-blue-300 bg-opacity-20 rounded-full' : ''}`}
                        onClick={() => setActiveTab('code')}>
                        Code
                    </h2>
                        
                    <h2 className={`text-sm cursor-pointer w-[50%] text-center py-0.5
            ${activeTab === 'preview' ? 'text-blue-600  bg-blue-300 bg-opacity-20 rounded-full' : ''}`}
                        onClick={() => setActiveTab('preview')}>
                        Preview
                    </h2>
                </div>
            </div>

            {/* Sandpack   */}
            <SandpackProvider
                template="react"
                files={{
                    ...fileData,
                    '/App.js': {
                        code: "/* This file is not required. */"
                    },
                    '/index.js': {
                        code: "/* This file is not required. */"
                    },
                    '/styles.css': {
                        code: "/* This file is not required. */"
                    },
                    'public/index.html': {
                        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
                        `
                    },

                }}
                theme={nightOwl}
                customSetup={{
                    dependencies: {
                        ...Lookup.DEPENDANCY
                    },
                    entry: "/src/main.jsx",
                }}
                options={{
                    activeFile: "/src/App.jsx",
                    showNavigator: true,
                    autorun: true,
                    autoReload: true,
                    externalResources: ["https://cdn.tailwindcss.com"]
                }}
            >
                <SandpackLayout>
                    {
                        activeTab === 'code' ?
                            <>
                                <SandpackFileExplorer style={{ height: '83.5vh' }} />
                                <SandpackCodeEditor style={{ height: '83.5vh' }} />
                            </>
                            :
                            <SandpackPreviewClient />
                    }
                </SandpackLayout>
            </SandpackProvider>

            {
                loading &&
                <div className='absolute top-0 h-full w-full rounded-lg flex gap-2 items-center justify-center bg-gray-900 opacity-80'>
                    <Loader2Icon className=' animate-spin h-10 w-10' />
                    <h2>Cooking...</h2>
                </div>
            }
        </div>
    )
}

export default CodeView