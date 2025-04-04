"use client";
import { useEffect, useState } from "react";
import { TransactionResponse, useTransaction } from "@/context/TransactionContext";
import { PaymentStatus, PaymentMethod } from "@/app/types/cartTypes";
import { format, parseISO } from 'date-fns';
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";

// Componente para exibir o status de pagamento
const StatusBadge = ({ status }: { status: string }) => {
  status = PaymentStatus[status] || status;

  const statusColors: Record<string, string> = {
    Pago: "bg-green-100 text-green-800",
    "Comissão recebida": "bg-blue-100 text-blue-800",
    Processando: "bg-yellow-100 text-yellow-800",
    Cancelado: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800"
  };

  return (
    <span
      className={`px-3 py-1 text-sm rounded-full ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  );
};

const TransactionItem = ({ transaction, mobile = false }: { transaction: TransactionResponse, mobile?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, isLoading] = useState(false);

  const { updateTransaction, fetchTransactions } = useTransaction();

  const formattedDate = format(parseISO(transaction.createdAt), "dd/MM/yyyy");
  const subtotal = transaction.cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const discount = 0;
  const total = subtotal - discount;
  const paymentMethod = transaction.paymentMethod ? PaymentMethod[transaction.paymentMethod] || transaction.paymentMethod : "Desconhecido";

  const handleCancelTransaction = async () => {
    isLoading(true);
    await updateTransaction({ status: "canceled" }, transaction.id);
    await fetchTransactions();
    isLoading(false);
  }

  if (mobile) {
    return (
      <>
        {loading && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <ClipLoader size={60} color="#111" />
          </div>
        )}
        <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
          <div className="flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
            <p className="text-lg font-semibold">Pedido #{transaction.id}</p>
            <button className="text-sm text-blue-600">{isOpen ? "Fechar" : "Detalhes"}</button>
          </div>
          <p className="text-sm text-gray-700">{transaction.customerName} - {formattedDate}</p>
          <p className="text-sm text-gray-700">Total: R$ {transaction.totalAmount}</p>
          <p className="text-sm text-gray-700">Pagamento: {paymentMethod}</p>
          <p className="text-sm text-gray-700"><StatusBadge status={transaction.status} /></p>
          
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 border-t pt-2"
            >
              <h3 className="text-md font-bold mb-2">Detalhes</h3>
              <ul>
                {transaction.cart.map(item => (
                  <li key={item.id} className="text-sm text-gray-600">{item.name} x{item.quantity || 1} - R${(item.price * (item.quantity || 1)).toFixed(2)}</li>
                ))}
              </ul>
              <div className="mt-2 text-right">
                <p>Subtotal: <span className="font-semibold">R${subtotal.toFixed(2)}</span></p>
                <p className="text-red-600">Desconto: <span className="font-semibold">R${discount.toFixed(2)}</span></p>
                <p className="text-lg font-bold">Total: <span>R${total.toFixed(2)}</span></p>
              </div>
              {transaction.status !== "canceled" && transaction.paymentMethod === "PIX" && (
                <div className="mt-4 text-center">
                  <button 
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    onClick={handleCancelTransaction}
                  >
                    Cancelar Pedido
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
        <ClipLoader size={60} color="#111" />
        </div>
      )}
      <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <td className="p-4 text-sm text-gray-700">#{transaction.id}</td>
        <td className="p-4 text-sm text-gray-700">{transaction.customerName}</td>
        <td className="p-4 text-sm text-gray-700">{formattedDate}</td>
        <td className="p-4 text-sm font-medium text-gray-900">R${transaction.totalAmount}</td>
        <td className="p-4 text-sm text-gray-700">{paymentMethod}</td>
        <td className="p-4">
          <StatusBadge status={transaction.status} />
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={6} className="p-4 bg-gray-100">
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2">Detalhes da Compra</h3>
                <table className="w-full text-center">
                  <thead className="bg-gray-200">
                    <tr>
                      {["ID", "PRODUTO", "VALOR", "QTD", "TOTAL"].map(header => (
                        <th key={header} className="p-3 text-sm font-medium text-gray-700">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transaction.cart.map(item => (
                      <tr key={item.id} className="border-t">
                        <td className="p-3">#{item.id}</td>
                        <td className="p-3">{item.name}</td>
                        <td className="p-3">R${item.price.toFixed(2)}</td>
                        <td className="p-3">x{item.quantity || 1}</td>
                        <td className="p-3">R${(item.price * (item.quantity || 1)).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="border-t">
                      <td colSpan={4} className="p-3 text-right">Subtotal</td>
                      <td className="p-3 font-semibold">R${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="p-3 text-right text-red-600">Desconto</td>
                      <td className="p-3 font-semibold">R${discount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="p-3 text-right">Total</td>
                      <td className="p-3 font-bold">R${total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
                {transaction.status !== "canceled" && transaction.status !== "paid" && transaction.paymentMethod === "PIX" && (
                  <div className="mt-4 text-center">
                    <button 
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      onClick={handleCancelTransaction}
                    >
                      Cancelar Pedido
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </td>
        </tr>
      )}
    </>
  );
};

const TransactionList = () => {
  const itemsPerPage = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchField, setSearchField] = useState<"client" | "date">("client");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [paymentFilter, setPaymentFilter] = useState("Todos");

  const { transactions, fetchTransactions } = useTransaction();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, paymentFilter]);

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = searchField === "client" 
        ? transaction.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
        : format(parseISO(transaction.createdAt), 'dd/MM/yyyy').includes(searchQuery);
      
      const matchesStatus = statusFilter === "Todos" || transaction.status === statusFilter;
      const matchesPayment = paymentFilter === "Todos" || transaction.paymentMethod === paymentFilter;
      
      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalItems = filteredTransactions.length ?? 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageLimit = 5;
  const groupStart = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;
  const groupEnd = Math.min(groupStart + pageLimit - 1, totalPages);

  const totalValueSold = filteredTransactions.reduce((acc, item) => {
    return acc + Number(item.totalAmount || 0);
  }, 0);
  const totalComissionGenerated = filteredTransactions.reduce((acc, item) => {
    return acc + Number(item.totalComission || 0);
  }, 0);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestão de Pedidos</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex flex-1 max-w-xl">
            <div className="relative flex items-stretch flex-grow">
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value as "client" | "date")}
                className="border rounded-l-lg px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="client">Nome</option>
                <option value="date">Data</option>
              </select>
              <input
                type="text"
                placeholder="Procurar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 pl-2 pr-4 py-2 border-t border-b rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todos">Todos Status</option>
              <option value="paid">Pago</option>
              <option value="waiting_payment">Processando</option>
              <option value="canceled">Cancelado</option>
              <option value="commission_paid">Comissão recebida</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todos">Todos Pagamentos</option>
              <option value="CREDIT_CARD">Crédito</option>
              <option value="PIX">Pix</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="hidden sm:block">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  {["PEDIDO", "CLIENTE", "DATA", "TOTAL", "PAGAMENTO", "STATUS"].map((header) => (
                    <th key={header} className="p-3 text-sm font-medium text-gray-600 text-left">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="sm:hidden flex flex-col gap-4 p-4">
            {currentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} mobile />
            ))}
          </div>

          <div className="border-t p-4">
            <span>Subtotais: </span>
            <p>Total vendido: {totalValueSold.toFixed(2)}</p> 
            <p>Total comissão recebida: {totalComissionGenerated.toFixed(2)}</p> 
          </div>
          
          <div className="flex justify-between items-center p-4 border-t">
            <span className="text-sm text-gray-600">
              Mostrando {startIndex + 1}-{endIndex} de {totalItems}
            </span>
            
            <div className="flex justify-center p-4">
              {/* Botão anterior */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 border rounded bg-red-600 disabled:opacity-50"
              >
                &lt;
              </button>

              {/* Páginas limitadas */}
              {Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 mx-1 border rounded ${
                    currentPage === page ? "bg-red-600 text-white" : "bg-white"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Botão próximo */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 border rounded bg-red-600 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
