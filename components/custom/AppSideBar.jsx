import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '../ui/button'
import { MessageCircle } from 'lucide-react'
import WorkspaceHistory from './WorkspaceHistory'
import SideBarFooter from './SideBarFooter'

const AppSideBar = () => {
    return (
        <div>
            <Sidebar>
                <SidebarHeader className='p-5'>
                    <Image src={'/logo.png'} alt="logo" width={60} height={60} />
                    <Button className='mt-5'> <MessageCircle/> Start new Chat</Button>
                </SidebarHeader>
                <SidebarContent className='p-5'>
                    <SidebarGroup>
                        <WorkspaceHistory/>
                    </SidebarGroup>
                    {/* <SidebarGroup /> */}
                </SidebarContent>
                <SidebarFooter>
                    <SideBarFooter/>
                </SidebarFooter>
            </Sidebar>
        </div>
    )
}

export default AppSideBar