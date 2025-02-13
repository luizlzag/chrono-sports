"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { getStock } from "@/api/axios/api";
import { Item } from "@/app/types/cartTypes";
import { Search } from "lucide-react";

const fetchStock = async (): Promise<Item[]> => {
  try {
    const data = await getStock();
    if (!data || !Array.isArray(data.products)) {
      console.error("Formato de resposta inválido:", data);
      return [];
    }

    return data.products.map((product: { id: number; name: string; stock: { quantity: number }[] }) => ({
      id: product.id,
      name: product.name,
      quantity: product.stock.length > 0 ? product.stock[0].quantity : 0,
    }));
  } catch (error) {
    console.error("Erro ao carregar o estoque", error);
    return [];
  }
};

const StockPage = () => {
  const { data: stock, isLoading, isError } = useQuery({
    queryKey: ["stock"],
    queryFn: fetchStock,
    staleTime: 1000 * 60 * 5,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStock = stock
    ? stock.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-white w-full">
      <div className="w-full max-w-6xl p-4 border border-gray-300 rounded-xl shadow-lg bg-white flex flex-col items-center">
        <h2 className="text-3xl font-bold text-black mb-4 uppercase tracking-wide">
          Estoque
        </h2>

        {/* Campo de pesquisa estilizado */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-xl mb-4"
        >
          <input
            type="text"
            placeholder="Buscar produto..."
            className="w-full p-3 border border-gray-400 rounded-lg pl-10 outline-none focus:ring-2 focus:ring-red-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-500" size={20} />
        </motion.div>

        {isLoading ? (
          <p className="text-gray-500">Carregando estoque...</p>
        ) : isError ? (
          <p className="text-red-500">Erro ao carregar o estoque.</p>
        ) : filteredStock.length > 0 ? (
          <div className="w-full">
            {/* Tabela para desktop com largura expandida */}
            <div className="hidden md:block w-full">
              <table className="w-full text-left rounded-lg overflow-hidden border border-gray-300">
                <thead className="bg-black text-white">
                  <tr>
                    {["Produto", "Quantidade"].map((header) => (
                      <th key={header} className="py-3 px-6 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredStock.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-gray-300 transition"
                      >
                        <td className="py-4 px-6 text-black font-medium">{item.name}</td>
                        <td className="py-4 px-6 font-bold">{item.quantity}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Layout Mobile otimizado */}
            <div className="md:hidden flex flex-col gap-2 w-full">
              <AnimatePresence>
                {filteredStock.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 border border-gray-300 rounded-lg bg-gray-50 text-center shadow-md"
                  >
                    <p className="font-semibold text-black">{item.name}</p>
                    <p className="font-bold">
                      Quantidade: {item.quantity}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-gray-500 mt-4"
          >
            Nenhum item encontrado.
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default StockPage;
