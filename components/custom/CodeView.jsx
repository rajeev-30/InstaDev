"use client"

import React, { useContext, useState } from "react";
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

const CodeView = () => {
  const [activeTab, setActiveTab] = useState('code')
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE)
  const {messages, setMessages} = useContext(MessageContext);

  const GenerateAiCode = async (input) => {
    const PROMPT = messages[messages?.length - 1]?.content + Prompt.CODE_GEN_PROMPT;
    const response = await axios.post('/api/gen-ai-code', {
      prompt: PROMPT,
    });
    const data = await response.json();
    return data;
  };

  return (
    <div>
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
      <SandpackProvider 
        files={files}
        template="react" theme={'dark'}
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
                <SandpackFileExplorer style={{height: '82vh'}}/>
                <SandpackCodeEditor style={{height: '82vh'}}/>
              </>
            :
              <SandpackPreview style={{height: '82vh'}} showNavigator={true}/>
            }        
          
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default CodeView;
