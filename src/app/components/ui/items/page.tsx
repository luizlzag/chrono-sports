"use client";
import Image from "next/image";
import React from "react";
import { IoMdAddCircle } from "react-icons/io";


const itensList = [
    {
        id: '1',
        img: '',
        name: 'LUVA VERMELHA',
        price: 123.90
    },
    {
        id: '2',
        img: '',
        name: 'LUVA AZUL',
        price: 101.90
    },
    {
        id: '3',
        img: '',
        name: 'LUVA AZUL',
        price: 135.90
    },
    {
        id: '4',
        img: '',
        name: 'LUVA AZUL',
        price: 295.90
    },
];

function Itens() {
    type Item = {
        id: string;
        img: string;
        name: string;
        price: number;
    };
    
    const addToCart = (item: Item) => {
        // Verifica se existe algo no 'cart'
        const cartData = localStorage.getItem('cart');
        let cart: Item[] = cartData ? JSON.parse(cartData) : [];

        // Adiciona o novo item ao carrinho
        cart.push(item);

        // Atualiza o localStorage com o novo carrinho
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    return (
        <div className="md:grid md:grid-cols-4">
            {itensList.map((i) =>
                <div className="flex mx-3" key={i.id}>
                    <div className="w-screen rounded shadow py-3 px-3 mb-3 bg-white grid grid-cols-2">
                        <Image
                            src='/luvavermelha.png'
                            alt="luva vermelha"
                            width={80}
                            height={80} />
                        <div className="bg-white">
                            <p className="font-semibold bg-white">{i.name}</p>
                            <p className="bg-red-600 px-2 py-2 rounded-md text-white font-semibold text-center text-lg"><span className="font-thin text-sm">R$</span>{i.price}</p>
                            <button
                                className="flex items-center gap-2 hover:text-green-700"
                                onClick={() => addToCart(i)}
                            >
                                Adicionar item <IoMdAddCircle className="bg-white" size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Itens;
