import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStock } from "@/api/axios/api";
import { handleTransactionError } from "@/context/errorHandler";
import { Item } from "@/app/types/cartTypes";

const StockPage = () => {
  const [stock, setStock] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStock()
        .then(({ data }) => {
            setStock(data);
            setLoading(false);
        })
        .catch((error) => {
            console.error(error);
            handleTransactionError();
            setLoading(false);
        });    
  }, []);

  if (loading) return <p className="text-center mt-4">Carregando estoque...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Estoque</h2>
      <table className="w-full text-center">
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
  );
};

export default StockPage;
