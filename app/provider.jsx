"use client"
import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import Header from '@/components/custom/Header'
import { MessageContext } from '@/context/MessageContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import dotenv from 'dotenv';
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import AppSideBar from '@/components/custom/AppSideBar'
import { SidebarProvider } from '@/components/ui/sidebar'
dotenv.config();

const Provider = ({children}) => {
  const [messages, setMessages] = useState("");
  const [userDetails, setUserDetails] = useState();
  const convex=useConvex();

  useEffect(()=>{
    IsAuthenticated();
  },[])

  const IsAuthenticated = async() =>{
    if(typeof window!==undefined){
      const user = JSON.parse(localStorage.getItem('user'));
      const result = await convex.query(api.users.GetUser, {
        email:user?.email,
      })
      setUserDetails(result);
      console.log(result)
    }
  }
  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY}>
        <UserDetailContext.Provider value={{userDetails, setUserDetails}}>
          <MessageContext.Provider value={{messages, setMessages}}>
            <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            >
                <Header/>
              <SidebarProvider defaultOpen={false}>
                <AppSideBar/>
                {children}
              </SidebarProvider>
            </NextThemesProvider>
          </MessageContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </div>
  )
}

export default Provider