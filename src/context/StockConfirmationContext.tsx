'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { handleTransactionError } from "./errorHandler";
import { getStockConfirmation } from '@/api/axios/api';
import { createStockConfirmation } from "@/api/axios/api";

export type StockConfirmationGetResponse = {
    confirmed?: boolean;
    message?: string;
}

interface StockConfirmation {
    stockConfirmed: { confirmed: boolean | null, message: string | null };
    fetchStockConfirmed: () => Promise<void>;
    updateStockConfirmation: (updateData: any) => Promise<void>;
}

const StockConfirmationContext = createContext<StockConfirmation | undefined>(undefined);

export function StockConfirmationProvider({ children }: { children: ReactNode }) {
    const [stockConfirmed, setStockConfirmed] = useState({
        confirmed: null, message: null
    });

    const fetchStockConfirmed = async (): Promise<void> => {
        try {
            const data = await getStockConfirmation();
            setStockConfirmed(data);
        } catch (err) {
            handleTransactionError();
            throw Error("Error fetching stockConfirmations");
        }
    }

    const updateStockConfirmation = async (updateData: any): Promise<void> => {
        try {
            const data = await createStockConfirmation(updateData);
            await fetchStockConfirmed();
        } catch (err) {
            handleTransactionError();
            throw Error("Error fetching stockConfirmations");
        }
    }
    
    return (
        <StockConfirmationContext.Provider value={{ stockConfirmed, fetchStockConfirmed, updateStockConfirmation }}>
            { children }
        </StockConfirmationContext.Provider>
    );
}

export function useStockConfirmation() {
    const context = useContext(StockConfirmationContext);
    if (!context) {
        throw new Error('useStockConfirmation must be used within a StockConfirmationProvider');
    }
    return context;
}
