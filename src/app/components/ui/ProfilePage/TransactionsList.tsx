"use client";
import { useState } from "react";
import { Search, ChevronDown, Circle } from "lucide-react";

// Componente para exibir o status de pagamento
const StatusBadge = ({ status }: { status: string }) => {
  const statusColors: Record<string, string> = {
    Pago: "bg-green-100 text-green-800",
    Processando: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`px-3 py-1 text-sm rounded-full ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  );
};

// Componente para cada item da transação
const TransactionItem = ({
  id,
  client,
  date,
  total,
  payment,
  status,
}: {
  id: string;
  client: string;
  date: string;
  total: string;
  payment: string;
  status: string;
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-4 text-sm text-gray-700">#{id}</td>
      <td className="p-4 text-sm text-gray-700">{client}</td>
      <td className="p-4 text-sm text-gray-700">{date}</td>
      <td className="p-4 text-sm font-medium text-gray-900">{total}</td>
      <td className="p-4 text-sm text-gray-700">{payment}</td>
      <td className="p-4">
        <StatusBadge status={status} />
      </td>
    </tr>
  );
};

// Componente principal da lista de transações
const TransactionList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const transactions = [
    { id: "0001", client: "Caetano Veloso", date: "29/01/2025", total: "R$300,00", payment: "Crédito", status: "Processando" },
    { id: "0002", client: "Maria Bethânia", date: "25/01/2025", total: "R$189,54", payment: "Crédito", status: "Processando" },
    { id: "0003", client: "William Bonner", date: "25/01/2025", total: "R$891,50", payment: "Débito", status: "Pago" },
    { id: "0004", client: "Tata Werneck", date: "20/01/2025", total: "R$300,00", payment: "Pix", status: "Pago" },
    // Adicione mais transações para testar a paginação
  ];

  const totalItems = transactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 border rounded ${
            currentPage === i ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 mx-1 border rounded"
          >
            &lt;
          </button>
        )}
        {pages}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 mx-1 border rounded"
          >
            &gt;
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestão de Pedidos</h2>

        {/* Filtros e busca */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Procurar..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="ml-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Todos">Todos</option>
            <option value="Pago">Pago</option>
            <option value="Processando">Processando</option>
          </select>
        </div>

        {/* Tabela de transações */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {["PEDIDO", "CLIENTE", "DATA", "TOTAL", "PAGAMENTO", "STATUS"].map((header) => (
                  <th
                    key={header}
                    className="p-3 text-sm font-medium text-gray-600 text-left whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} {...transaction} />
              ))}
            </tbody>
          </table>

          {/* Rodapé com paginação */}
          <div className="flex justify-between items-center p-4 border-t">
            <span className="text-sm text-gray-600">
              Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems}
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Itens por página:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>

          {/* Paginação */}
          <div className="flex justify-center p-4 border-t">
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;