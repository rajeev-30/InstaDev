import React, { useContext } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import Lookup from '@/data/Lookup'
import { Button } from '../ui/button'
import { useGoogleLogin } from '@react-oauth/google'
import { UserDetailContext } from '@/context/UserDetailContext'
import axios from 'axios'
import { useMutation } from 'convex/react'
import uuid4 from 'uuid4'
import { api } from '@/convex/_generated/api'

const SigninDialog = ({openDialog,closeDialog}) => {
    const {userDetails, setUserDetails} = useContext(UserDetailContext);
    const CreateUser=useMutation(api.users.CreateUser)
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
        console.log(tokenResponse);
        const userInfo = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            { headers: { Authorization: 'Bearer '+tokenResponse?.access_token } },
        );
    
        console.log(userInfo);
        const user = userInfo.data;
        await CreateUser({
            name:user?.name,
            email:user?.email,
            picture:user?.picture,
            uid:uuid4()
        })

        if(typeof window !== undefined){
            localStorage.setItem('user',JSON.stringify(user));
        }

        setUserDetails(userInfo?.data);
        closeDialog(false);
        },
        onError: errorResponse => console.log(errorResponse),
    });

    return (
        <div>
            <Dialog open={openDialog} onOpenChange={closeDialog}>
                {/* <DialogTrigger>Open</DialogTrigger> */}
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription>
                            <div className="flex flex-col items-center justify-center gap-3">
                                <div className='font-bold text-2xl text-white text-center'>{Lookup.SIGNIN_HEADING}</div>
                                <div className='mt-2 text-center'>{Lookup.SIGNIN_SUBHEADING}</div>
                                <Button
                                    onClick={googleLogin}
                                    className="bg-blue-500 text-white hover:bg-blue-400 mt-3">Sign in with google</Button>
                                <div>{Lookup.SIGNIn_AGREEMENT_TEXT}</div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default SigninDialog