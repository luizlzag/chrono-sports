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
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-50 w-full">
      <div className="w-full max-w-4xl p-6 border rounded-xl shadow-md bg-white flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Estoque</h2>

        {/* Campo de pesquisa com animação */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md mb-4"
        >
          <input
            type="text"
            placeholder="Buscar produto..."
            className="w-full p-3 border border-gray-300 rounded-lg pl-10 outline-none focus:ring-2 focus:ring-blue-500 transition"
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
            {/* Tabela para desktop */}
            <div className="hidden md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    {["Produto", "Quantidade"].map((header) => (
                      <th key={header} className="py-2 text-gray-600 font-medium">{header}</th>
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
                        className="border-b hover:bg-gray-100 transition"
                      >
                        <td className="py-3">{item.name}</td>
                        <td className="py-3 text-center font-medium">{item.quantity}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Layout Mobile */}
            <div className="md:hidden flex flex-col gap-3 w-full">
              <AnimatePresence>
                {filteredStock.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center"
                  >
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-gray-600">Quantidade: <span className="font-semibold">{item.quantity}</span></p>
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
