"use client";
import React,{useState} from "react";

import { IoMdCart } from "react-icons/io";

function ItensCart() {
    const [openCart, setOpenCart] = React.useState(false);

    return ( 
        <div>
            <div className="fixed rounded-full bottom-2 right-2 py-3 px-3 bg-red-700 opacity-90 hover:opacity-100 z-50 cursor-pointer">
            <IoMdCart size={24} color="white" onClick={()=> setOpenCart(!openCart)} />
            </div>

            {openCart && (
                <div className="z-50">
                    <div className="fixed bottom-16 right-3 bg-white px-4 py-4 z-50 rounded">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex gap-5">
                                    <h1>LUVA VERMELHA</h1>
                                    <p>5,90</p>
                                    <p>10</p>
                                    <p>59,00</p>
                                </div>
                                <div className="flex gap-5">
                                    <h1>LUVA VERMELHA</h1>
                                    <p>5,90</p>
                                    <p>10</p>
                                    <p>59,00</p>
                                </div>
                            </div>
                            <div className="grid  gap-2 pt-1 border-t-[0.1rem] border-red-700">
                                <p className="font-bold text-right">Total: 118,00</p>
                                <button className="px-2 py-2 bg-red-700 rounded text-white">PAGAMENTO</button>
                            </div>
                    </div>
                    <div onClick={()=> setOpenCart(false)} className="bg-gray-700 opacity-30 fixed top-0 w-full h-full z-0 "></div>
                </div>
            )}
        </div>
    );
}

export default ItensCart;