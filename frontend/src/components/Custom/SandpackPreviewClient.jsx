import { SandpackPreview, useSandpack } from '@codesandbox/sandpack-react'
import React, { useEffect, useRef } from 'react'

const SandpackPreviewClient = () => {
    const previewRef = useRef();
    const { sandpack } = useSandpack();

    useEffect(()=>{
        GetSandpackClient()
    },[sandpack])

    const GetSandpackClient = async() => {
        const client = previewRef.current?.getClient();
        if(client){
            // console.log("client: ",client)
            const result  = await client.getCodeSandboxURL();
            // console.log("result: ",result)
        }
    }


    return (
        <div className='w-full'>
            <SandpackPreview
                ref={previewRef}
                style={{ height: '83.5vh' }} 
                showNavigator={true} />
        </div>
    )
}

export default SandpackPreviewClient