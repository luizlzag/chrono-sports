import Image from 'next/image';
import * as React from 'react';
import logo from '../../../../../public/logo.png';
import AvatarDrop from '../avatar/AvatarDrop';

function HeaderPage() {
    return ( 
        <div className='flex justify-between  fixed top-0 inset-x-0 p-3'>
            <div>
                <Image
                src={logo}
                alt='logo'
                width={80}
                height={80}
                />
            </div>
            <div>
                <AvatarDrop/>
            </div>
        </div>
     );
}

export default HeaderPage;