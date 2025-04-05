"use client"

import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import axios from "axios";
import { MessageContext } from "@/context/MessageContext";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";

const CodeView = () => {
  const {id} = useParams();
  const {userDetails, setUserDetails } = useContext(UserDetailContext);
  const [activeTab, setActiveTab] = useState('code');
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const {messages, setMessages} = useContext(MessageContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const [loading, setLoading] = useState(false);
  const convex = useConvex();
  const UpdateToken = useMutation(api.users.UpdateToken);

  useEffect(()=>{
    id && GetFiles();
  },[id])

  const GetFiles = async() => {
    setLoading(true)
    const res = await convex.query(api.workspace.GetWorkspace, {
      workspaceId:id
    })

    const mergedFiles = {...Lookup.DEFAULT_FILE, ...res?.fileData};
    setFiles(mergedFiles);
    setLoading(false)
  }

  useEffect(() => {
    if (messages?.length > 0) {
        const role = messages[messages?.length - 1].role;
        if (role == 'user') {
          GenerateAiCode();
        }
    }
    console.log(messages)
}, [messages])

  const GenerateAiCode = async (input) => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages)+" "+Prompt.CODE_GEN_PROMPT;
    const res = await axios.post('/api/gen-ai-code', {
      prompt: PROMPT,
    });
    console.log(res.data);
    const aiRes = res.data;

    const mergedFiles = {...Lookup.DEFAULT_FILE, ...aiRes?.files};
    setFiles(mergedFiles);
    await UpdateFiles({
      workspaceId:id,
      files: aiRes?.files
    });
    
    const token = Number(userDetails?.token)-Number(countTonken(JSON.stringify(aiRes)))
    //Update token in databse
    await UpdateToken({
      userId:userDetails?._id,
      token:token
    })

    setActiveTab('code')
    setLoading(false)
  };

  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-1 border rounded-t-md">
        <div className="flex items-center justify-center flex-wrap shrink-0  bg-black p-1 w-[150px] rounded-full">
          <h2 className={`text-sm cursor-pointer w-[50%] text-center py-0.5
            ${activeTab === 'code' ? 'text-blue-600  bg-blue-500 bg-opacity-20 rounded-full' : ''}`} 
            onClick={()=>setActiveTab('code')}>
              Code
          </h2>

          <h2 className={`text-sm cursor-pointer w-[50%] text-center py-0.5
            ${activeTab === 'preview' ? 'text-blue-600  bg-blue-500 bg-opacity-20 rounded-full' : ''}`}
            onClick={()=>setActiveTab('preview')}>
              Preview
          </h2>
        </div>
      </div>


      {/* Sandpack  */}
      <SandpackProvider 
        template="react"
        files={files}
        theme={'dark'}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY
          }
      }}
      options={{
        externalResources:["https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"]
      }}
      >
            <SandpackLayout>
              {
                activeTab === 'code' ?
                <>
                  <SandpackFileExplorer style={{height: '82.5vh'}}/>
                  <SandpackCodeEditor style={{height: '82.5vh'}}/>
                </>
              :
                <SandpackPreview style={{height: '82.5vh'}} showNavigator={true}/>
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
  );
};

export default CodeView;
