"use client"; 
import PaymentCheckout from '../../components/ui/payament/PayamentComponent';
import React, { Suspense } from 'react';

function PayamentPage() {
    return ( 
        <Suspense fallback={<div>Loading...</div>}>
      <PaymentCheckout />
    </Suspense>
     );
}

export default PayamentPage;