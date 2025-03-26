import * as React from 'react';
import AvatarDrop from '../avatar/AvatarDrop';

function HeaderPage() {
    return ( 
        <div className='flex justify-between  fixed top-0 inset-x-0 p-3'>
            <div>
                <img
                src="/logo.png"
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