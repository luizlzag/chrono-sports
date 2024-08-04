import HeaderPage from '@/app/components/ui/header/HeaderPage';
import CartContainer from '@/app/components/ui/pageCart/CartContainer';
import * as React from 'react';
function HomePage() {
    return (
        <div>
            <HeaderPage/>
            <CartContainer/>
        </div>
      );
}

export default HomePage;