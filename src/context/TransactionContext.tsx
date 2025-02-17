"use client";

import { createContext, useState, useContext, useCallback } from "react";
import { getRecentTransaction, createTransaction, updateTransaction, getTransaction, getTransactions } from "@/api/axios/api";
import { Item } from "@/app/types/cartTypes";
import { handleTransactionError } from "./errorHandler";

interface TransactionRequest {
    cart?: Item[];
    paymentMethod?: string | null;
    customerName?: string | null;
    status?: string | null;
}

export interface TransactionResponse {
    id: number;
    gymId: number;
    userId: number;
    customerName: string | null;
    paymentMethod: string | null;
    paymentLinkId: string | null;
    paymentIntentId: string | null;
    status: string;
    cart: Item[];
    totalAmount: string;
    currency: string;
    createdAt: string;
    updatedAt: string;
    softDelete: boolean;
}

interface TransactionContextType {
    transaction: TransactionResponse | null;
    transactions: TransactionResponse[];
    setTransaction: (transaction: TransactionResponse | null) => void;
    fetchTransaction: () => Promise<void>;
    createTransaction: (transactionData: TransactionRequest) => Promise<void>;
    updateTransaction: (transactionData: TransactionRequest, transactionId: number) => Promise<void>;
    getTransaction: (transactionId: number) => Promise<void>;
    fetchTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
    const [transaction, setTransaction] = useState<TransactionResponse | null>(null);
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);

    const fetchTransaction = async () => {
        try {
            const data = await getRecentTransaction();
            setTransaction(data);
        } catch (error) {
            handleTransactionError();
        }
    };

    const handleCreateTransaction = async (transactionData: TransactionRequest) => {
        try {
            const response = await createTransaction(transactionData);
            setTransaction(response);
        } catch (error) {
            handleTransactionError();
        }
    };

    const handleUpdateTransaction = async (transactionData: TransactionRequest, transactionId: number) => {
        try {
            const response = await updateTransaction(transactionData, transactionId);
            setTransaction(response);
        } catch (error) {
            handleTransactionError();
        }
    };

    const handleGetTransaction = async (transactionId: number) => {
        try {
            const response = await getTransaction(transactionId);
            setTransaction(response);
        } catch (error) {
            handleTransactionError();
        }
    }

    const fetchTransactions = useCallback(async () => {
        try {
            const data = await getTransactions();
            setTransactions(data);
        } catch (error) {
            handleTransactionError();
        }
    }, []);

    return (
        <TransactionContext.Provider value={{ transaction, transactions, setTransaction, fetchTransaction, createTransaction: handleCreateTransaction, updateTransaction: handleUpdateTransaction, getTransaction: handleGetTransaction, fetchTransactions }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error("useTransaction must be used within a TransactionProvider");
    }
    return context;
};
