"use client";
import React, { useState, useEffect } from "react";
import { IoMdCart, IoMdAdd, IoMdRemove, IoMdTrash } from "react-icons/io";

type CartItem = {
    id: string;
    img: string;
    name: string;
    price: number;
    quantity: number;
};

const ItensCart: React.FC = () => {
    const [openCart, setOpenCart] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        if (openCart) {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                const parsedCartItems: CartItem[] = JSON.parse(storedCart);

                const updatedCartItems = parsedCartItems.map(item => ({
                    ...item,
                    quantity: item.quantity ?? 1,
                }));

                setCartItems(updatedCartItems);
            }
        }
    }, [openCart]);

    const calculateTotal = (): number => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const updateCartItems = (updatedItems: CartItem[]) => {
        setCartItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
    };

    const incrementQuantity = (itemId: string) => {
        const updatedItems = cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCartItems(updatedItems);
    };

    const decrementQuantity = (itemId: string) => {
        const updatedItems = cartItems.map(item =>
            item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        );
        updateCartItems(updatedItems);
    };

    const removeItem = (itemId: string) => {
        const updatedItems = cartItems.filter(item => item.id !== itemId);
        updateCartItems(updatedItems);
    };

    return (
        <div>
            <div className="fixed rounded-full bottom-2 right-2 py-3 px-3 bg-red-700 opacity-90 hover:opacity-100 z-50 cursor-pointer">
                <IoMdCart size={24} color="white" onClick={() => setOpenCart(!openCart)} />
            </div>

            {openCart && (
                <div className="z-50">
                    <div className="fixed bottom-16 right-3 bg-white px-6 py-4 z-50 rounded-lg shadow-lg w-80">
                        <div className="grid grid-cols-1 gap-4">
                            {cartItems.length > 0 ? cartItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <h1 className="text-gray-800 font-medium">{item.name}</h1>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => decrementQuantity(item.id)} className="bg-gray-200 rounded p-1 hover:bg-gray-300">
                                            <IoMdRemove />
                                        </button>
                                        <p className="text-gray-800">{item.quantity}</p>
                                        <button onClick={() => incrementQuantity(item.id)} className="bg-gray-200 rounded p-1 hover:bg-gray-300">
                                            <IoMdAdd />
                                        </button>
                                    </div>
                                    <p className="text-gray-800 font-medium">{(item.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => removeItem(item.id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600">
                                        <IoMdTrash />
                                    </button>
                                </div>
                            )) : (
                                <p className="text-gray-500">O carrinho está vazio.</p>
                            )}
                        </div>
                        <div className="grid gap-4 pt-4 border-t border-gray-200">
                            <p className="font-bold text-right text-lg">Total: R${calculateTotal().toFixed(2)}</p>
                            <button className="px-4 py-2 bg-red-700 rounded text-white w-full hover:bg-red-800">PAGAMENTO</button>
                        </div>
                    </div>
                    <div onClick={() => setOpenCart(false)} className="bg-gray-700 opacity-30 fixed top-0 w-full h-full z-0"></div>
                </div>
            )}
        </div>
    );
};

export default ItensCart;
