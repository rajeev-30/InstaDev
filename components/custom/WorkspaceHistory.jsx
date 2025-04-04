"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { Result } from 'postcss';
import React, { useContext, useEffect, useState } from 'react'
import { useSidebar } from '../ui/sidebar';
import Link from 'next/link';

const WorkspaceHistory = () => {
    const {userDetails, setUserDetails}  = useContext(UserDetailContext);
    const convex = useConvex();
    const [workspaceList, setWorkspaceList] = useState()
    const {toggleSidebar} = useSidebar();

    useEffect(()=>{
        userDetails && GetAllWorkspace();
    },[userDetails])

    const GetAllWorkspace = async() =>{
        const res = await convex.query(api.workspace.GetAllWorkspace, {
            userId: userDetails._id
        })
        setWorkspaceList(res)
        console.log(res);
    }

    return (
        <div>
            <h2 className='font-medium text-lg'>Your chats</h2>
            <div>
                {
                    workspaceList?.reverse().map((workspace, index)=>(
                        <Link 
                            href={`/workspace/${workspace?._id}`} 
                            key={index}>
                                <h2  onClick={toggleSidebar} className='text-md text-gray-400 mt-2 font-light cursor-pointer hover:text-white'>
                                    {workspace?.messages[0]?.content}
                                </h2>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default WorkspaceHistory