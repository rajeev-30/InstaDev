import Image from 'next/image'
import React, { useContext } from 'react'
import { Button } from '../ui/button'
import Colors from '@/data/Colors'
import { UserDetailContext } from '@/context/UserDetailContext'
import { Download, Rocket } from 'lucide-react'

const Header = () => {
  const {userDetails, setUserDetails} = useContext(UserDetailContext);
  return (
    <div className='py-1 px-4 flex justify-between items-center border-b'>
        <Image src={"/logo.png"} alt="logo" width={60} height={60} />

      { !userDetails?.name ? 
          <div className='flex gap-4'>
            <Button variant="ghost">Sign In</Button>
            <Button 
            className="text-white"
            style={{backgroundColor: Colors.BLUE}} 
            >
                Get Started
            </Button>
          </div>
          :
          <div className='flex gap-4'>
            <Button variant="ghost"><Download/> Export</Button>
            <Button 
            className="text-white"
            style={{backgroundColor: Colors.BLUE}} 
            >
              <Rocket/> Deploy
            </Button>
          </div>
        }
    </div>
  )
}

export default Header