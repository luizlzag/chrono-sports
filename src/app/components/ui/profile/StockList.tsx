"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { getStock } from "@/api/axios/api";
import { Item } from "@/app/types/cartTypes";
import { AlertTriangle } from "lucide-react";

const fetchStock = async (): Promise<Item[]> => {
  try {
    const { data } = await getStock();
    return data || [];
  } catch (error) {
    throw new Error("Erro ao carregar o estoque");
  }
};

const StockPage = () => {
  const { data: stock, isLoading, isError } = useQuery({
    queryKey: ["stock"],
    queryFn: fetchStock,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gray-100 w-full">
      <div className="w-full max-w-6xl p-6 border rounded-xl shadow-xl bg-white flex flex-col justify-center items-center min-h-[80vh]">
        <h2 className="text-3xl font-bold text-center mb-6">Estoque</h2>

        {isLoading && (
          <div className="flex flex-col gap-4 w-full">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 p-4 rounded-lg w-full"
              ></div>
            ))}
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center bg-red-100 p-4 rounded-lg w-full">
            <AlertTriangle className="text-red-600 mr-2" />
            <p className="text-red-600">Erro ao carregar estoque.</p>
          </div>
        )}

        {stock && stock.length > 0 ? (
          <div className="w-full">
            {/* Tabela Desktop */}
            <div className="hidden md:block w-full">
              <table className="w-full border-collapse border rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    {["ID", "Produto", "Quantidade"].map((header) => (
                      <th key={header} className="p-3 text-sm font-medium text-gray-700">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {stock.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="border-t"
                      >
                        <td className="p-3">#{item.id}</td>
                        <td className="p-3">{item.name}</td>
                        <td className="p-3">{item.quantity}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Layout Mobile */}
            <div className="md:hidden flex flex-col gap-4 w-full">
              <AnimatePresence>
                {stock.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 border rounded-lg shadow bg-gray-50 w-full"
                  >
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">ID: #{item.id}</p>
                    <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          !isLoading &&
          !isError && <p className="text-center text-gray-500 mt-6">Nenhum item em estoque.</p>
        )}
      </div>
    </div>
  );
};

export default StockPage;