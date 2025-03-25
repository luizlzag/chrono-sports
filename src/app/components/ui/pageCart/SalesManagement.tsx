"use client";
import React, { useState, useEffect } from "react";
import { useTransaction } from "@/context/TransactionContext";
import { useStockConfirmation } from "@/context/StockConfirmationContext";
import { Item } from "@/app/types/cartTypes";
import { ClipLoader } from "react-spinners";
import { Itens } from "./Itens";
import { ItensCart } from "./ItensCart";
import StockConfirmationModal from "../modals/StockConfirmationModal";

const CartContainer: React.FC = () => {
    const [openCart, setOpenCart] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFetched, setIsFetched] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);

    const { transaction, updateTransaction, createTransaction, fetchTransaction } = useTransaction();
    const { stockConfirmed, fetchStockConfirmed } = useStockConfirmation();

    useEffect(() => {
        if (!isFetched) {
            const fetchTransactionData = async () => {
                await fetchTransaction();
                setIsFetched(true);
            };

            const fetchStockConfirmedData = async () => {
                await fetchStockConfirmed();
            }

            fetchTransactionData();
            fetchStockConfirmedData();
        }
    }, [fetchStockConfirmed, fetchTransaction, isFetched]);

    useEffect(() => {
        if (stockConfirmed.confirmed != null) {
            setShowStockModal(true);
        }
    }, [stockConfirmed]);

    const canOpenCart = (state: React.SetStateAction<boolean>) => {
        if (stockConfirmed) {
            setOpenCart(state)
        }
    }

    const addToCart = (item: Item) => {
        setLoading(true);

        if (transaction === undefined) {
            setLoading(false);
            return;
        }

        if (!transaction) {
            createTransaction({ cart: [item] });
            setOpenCart(true);
            setLoading(false);
            return;
        }

        const newCart = transaction.cart ? [...transaction.cart] : [];

        const existingItem = newCart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity ?? 1) + 1;
        } else {
            newCart.push({ ...item, quantity: 1 });
        }

        updateTransaction({ cart: newCart }, transaction.id);
        setOpenCart(true);
        setLoading(false);
    };

    return (
        <div className="container p-4 mx-auto mt-20 relative">
            {loading && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                    <ClipLoader size={60} color="#fff" />
                </div>
            )}

            {showStockModal && (
                <StockConfirmationModal
                    onConfirm={() => setShowStockModal(false)}
                />
            )}

            <div className={`${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar itens..."
                        className="w-full p-2 border rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Itens addToCart={addToCart} searchTerm={searchTerm} />
                <ItensCart openCart={openCart} setOpenCart={canOpenCart} />
            </div>
        </div>
    );
};

export default CartContainer;
