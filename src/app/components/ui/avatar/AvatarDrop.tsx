"use client";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/navigation';

function AvatarDrop() {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [userName, setUserName] = React.useState<string>('');
    const open = Boolean(anchorEl);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const user = localStorage.getItem('user');
            if (user) {
                setUserName(JSON.parse(user).name);
            }
        }
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        setAnchorEl(null);
        router.push('/pages/profile');
    };  

    const handleQuiet = () => {
        setAnchorEl(null);
        if (typeof window !== "undefined") {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        router.push('/');
    };

    return (  
        <div className='flex items-center gap-5 text-white'>
            <div>
                <Avatar 
                    component="button" 
                    id="basic-menu" 
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>} 
                    alt="Remy Sharp" 
                    
                />

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleProfile}>PERFIL</MenuItem>
                    <MenuItem onClick={handleQuiet}>SAIR</MenuItem>
                    <Divider />
                    <MenuItem onClick={handleClose}>
                        <img
                            src="/chronocoin-removebg-preview.png"
                            alt='logo'
                            width={40}
                            height={40}
                        />
                        
                    </MenuItem>
                </Menu>
            </div>
            <div className='m-0'>
                <p>{userName}</p>
                <p></p>
            </div>
        </div>
    );
}

export default AvatarDrop;
