import { Download, Rocket } from 'lucide-react';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { Colors } from '@/data/Colors';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


const WorkspaceHeader = () => {
    const { user } = useSelector(store => store.user);
    const { fileData } = useSelector(store => store.workspace);
    const dispatch = useDispatch()

    const downloadProjectZip = async () => {
        const zip = new JSZip();
    
        // Add each file to the zip
        Object.entries(fileData).forEach(([path, file]) => {
            zip.file(path.startsWith("/") ? path.slice(1) : path, file.code || "");
        });
    
        // Generate the zip file
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "project");
    };


    
    return (
        <div className='py-1 px-4 flex justify-between items-center pt-2'>
            <Link to={'/'}>
                <img src={logo} alt="logo" width={60} height={60}/>
            </Link>

            {user &&
                <div className='flex gap-4 items-center'>
                    <Button
                        disabled={!fileData}
                        className="text-black cursor-pointer"
                        onClick={downloadProjectZip}
                        style={{ backgroundColor: Colors.WHITE }}><Download/> Export</Button>
                    <Button
                        className="text-black cursor-pointer"
                        // onClick={()=>dispatch(getSigninDialog(true))}
                        style={{ backgroundColor: Colors.BLUE }}
                    >
                        <Rocket/> Deploy
                    </Button>
                </div>
            }


        </div>
    )
}

export default WorkspaceHeader