import React, { useState, useEffect } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { getProducts } from "@/api/axios/api";
import { Item } from "@/app/types/cartTypes";

export const Itens: React.FC<{ 
    addToCart: (item: Item) => void, 
    searchTerm: string
}> = ({ addToCart, searchTerm }) => {
    const [itensList, setItensList] = useState<Item[]>([]);  // Armazena os itens da API
    const [error, setError] = useState<string | null>(null); // Estado de erro
    
    // Carregar produtos da API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts(); // Chama a API para obter a resposta
                const products = response.products; // Chama a API para obter produtos
               
                // Verifique se a resposta da API é um array
                if (Array.isArray(products)) {
                    setItensList(products); // Atualiza o estado com os produtos obtidos
                } else {
                    throw new Error("A resposta da API não é um array");
                }
            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
                setError("Erro ao carregar produtos"); // Trata erros
            }
        };

        fetchProducts();
    }, []);

    // Filtra itens com base no termo de busca
    const filteredItems = Array.isArray(itensList)
        ? itensList.filter((item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : []; // Garante que `itensList` é um array

    // Exibe uma mensagem de erro se houver falha na requisição
    if (error) {
        return <p>{error}</p>;
    }
    
    return (
        <div className="md:grid md:grid-cols-4 gap-4">
            {filteredItems.length ?? 0 > 0 ? filteredItems.map((i) =>
                <div className="flex" key={i.id}>
                    <div className="w-full rounded shadow py-3 px-3 mb-3 bg-white grid grid-cols-2">
                        <img
                            src={i.imageUrl || "/logo.png"}
                            alt={i.name}
                            width={80}
                            height={80}
                        />
                        <div className="bg-white">
                            <p className="font-semibold bg-white">{i.name}</p>
                            <p className="bg-red-600 px-2 py-2 rounded-md text-white font-semibold text-center text-lg">
                                <span className="font-thin text-sm">R$</span>{i.price}
                            </p>
                            <button
                                className="flex items-center gap-2 hover:text-green-700"
                                onClick={() => addToCart({ ...i, quantity: 1 })}
                            >
                                Vender item <IoMdAddCircle className="bg-white" size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">Nenhum item encontrado.</p>
            )}
        </div>
    );
};