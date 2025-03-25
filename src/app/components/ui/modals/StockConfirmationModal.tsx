import { getStock } from "@/api/axios/api";
import { Item } from "@/app/types/cartTypes";
import React, { useEffect, useState } from "react";
import { useStockConfirmation } from "@/context/StockConfirmationContext";

interface StockConfirmationModalProps {
    onConfirm: (state: boolean) => void;
}

const fetchStock = async (): Promise<Item[]> => {
    const data = await getStock();
    if (!data || !Array.isArray(data.products)) {
        console.error("Formato de resposta inválido:", data);
        return [];
    }

    return data.products.map((product: { id: number; name: string; stock: { quantity: number }[] }) => ({
        id: product.id,
        name: product.name,
        quantity: product.stock.length > 0 ? product.stock[0].quantity : 0,
        newQuantity: ""
    }));
};

const StockConfirmationModal: React.FC<StockConfirmationModalProps> = ({ onConfirm }) => {
    const [stockItems, setStockItems] = useState<Item[]>([]);

    const { stockConfirmed, updateStockConfirmation } = useStockConfirmation();

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetchStock();
            setStockItems(response);
        };
        fetchProducts();
    }, []);

    const handleStockChange = (index: number, newQuantity: number): void => {
        setStockItems((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, newQuantity: newQuantity } : item
            )
        );
    };

    const submitStock = async () => {        
        const postData = {
            detail: stockItems.map((item) => ({
                id: item.id,
                oldQuantity: item.quantity,
                newQuantity: Number(item.newQuantity),
                name: item.name,
                imageUrl: item.imageUrl ?? null,
            })),
        };
        if (!stockConfirmed.confirmed?.id) throw new Error("confirmation not found");
        await updateStockConfirmation(stockConfirmed.confirmed?.id, postData);
        onConfirm(true);
    }

    const isStockValid = (items: { newQuantity?: number }[]) => {
        return items.every((item) => 
            item.hasOwnProperty('newQuantity') && 
            item.newQuantity !== undefined && 
            item.newQuantity !== null && 
            !isNaN(Number(item.newQuantity))
        );
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-red-600 mb-4 text-center">Confirmação de Estoque</h2>
                <p className="text-gray-600 mb-4 text-center">
                    Informe a quantidade real de cada item em seu estoque. Você não poderá utilizar o sistema até confirmar.
                </p>

                {/* Desktop: Tabela */}
                <div className="hidden sm:block border border-gray-300 rounded overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-200 text-gray-700 text-sm">
                            <tr>
                                <th className="p-2 w-1/2">Produto</th>
                                <th className="p-2 w-1/6 text-center">Quantidade Sistema</th>
                                <th className="p-2 w-1/6 text-center">Seu Estoque Real</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockItems.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-4 text-center text-gray-500">Carregando itens...</td>
                                </tr>
                            ) : (
                                stockItems.map((item, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="p-2 truncate">{item.name}</td>
                                        <td className="p-2 text-center text-gray-600">{item.quantity}</td>
                                        <td className="p-2 text-center">
                                            <input
                                                type="number"
                                                className="w-full sm:w-20 p-2 border rounded border-gray-400 text-center"
                                                value={item.newQuantity}
                                                onChange={(e) => handleStockChange(index, e.target.valueAsNumber)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile: Card List */}
                <div className="sm:hidden flex flex-col gap-4">
                    {stockItems.length === 0 ? (
                        <p className="text-gray-500 text-center">Carregando itens...</p>
                    ) : (
                        stockItems.map((item, index) => (
                            <div key={index} className="border border-gray-300 rounded p-4 flex flex-col">
                                <span className="text-gray-700 font-medium">{item.name}</span>
                                <span className="text-gray-500 text-sm">Quantidade no sistema: {item.quantity}</span>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded border-gray-400 mt-2 text-center"
                                    placeholder="Digite o valor"
                                    value={item.newQuantity}
                                    onChange={(e) => handleStockChange(index, e.target.valueAsNumber)}
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* Botão de confirmação */}
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={submitStock}
                        disabled={!isStockValid(stockItems)}
                        className={`w-full sm:w-auto px-6 py-3 rounded-lg shadow-md text-white ${
                            !isStockValid(stockItems) ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        Confirmar Estoque
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockConfirmationModal;
