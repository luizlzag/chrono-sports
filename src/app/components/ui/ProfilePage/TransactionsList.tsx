"use client";
import { useEffect, useState } from "react";
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
    <tr className="hover:bg-gray-50 transition-colors cursor-pointer">
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
  const [searchField, setSearchField] = useState<"client" | "date">("client");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [paymentFilter, setPaymentFilter] = useState("Todos");

  const transactions = [
    { id: "0001", client: "Caetano Veloso", date: "29/01/2025", total: "R$300,00", payment: "Crédito", status: "Processando" },
    { id: "0002", client: "Maria Bethânia", date: "25/01/2025", total: "R$189,54", payment: "Crédito", status: "Processando" },
    { id: "0003", client: "William Bonner", date: "25/01/2025", total: "R$891,50", payment: "Débito", status: "Pago" },
    { id: "0004", client: "Tata Werneck", date: "20/01/2025", total: "R$300,00", payment: "Pix", status: "Pago" },
    { id: "0005", client: "Caetano Veloso", date: "29/01/2025", total: "R$300,00", payment: "Crédito", status: "Processando" },
    { id: "0006", client: "Maria Bethânia", date: "25/01/2025", total: "R$189,54", payment: "Crédito", status: "Processando" },
    { id: "0007", client: "William Bonner", date: "25/01/2025", total: "R$891,50", payment: "Débito", status: "Pago" },
    { id: "0008", client: "Tata Werneck", date: "20/01/2025", total: "R$300,00", payment: "Pix", status: "Pago" },
    { id: "0009", client: "Caetano Veloso", date: "29/01/2025", total: "R$300,00", payment: "Crédito", status: "Processando" },
    { id: "0010", client: "Maria Bethânia", date: "25/01/2025", total: "R$189,54", payment: "Crédito", status: "Processando" },
    { id: "0011", client: "William Bonner", date: "25/01/2025", total: "R$891,50", payment: "Débito", status: "Pago" },
    { id: "0012", client: "Tata Werneck", date: "20/01/2025", total: "R$300,00", payment: "Pix", status: "Pago" },
    { id: "0013", client: "Caetano Veloso", date: "29/01/2025", total: "R$300,00", payment: "Crédito", status: "Processando" },
    { id: "0014", client: "Maria Bethânia", date: "25/01/2025", total: "R$189,54", payment: "Crédito", status: "Processando" },
    { id: "0015", client: "William Bonner", date: "25/01/2025", total: "R$891,50", payment: "Débito", status: "Pago" },
    { id: "0016", client: "Tata Werneck", date: "20/01/2025", total: "R$300,00", payment: "Pix", status: "Pago" },
    { id: "0017", client: "Caetano Veloso", date: "29/01/2025", total: "R$300,00", payment: "Crédito", status: "Processando" },
    { id: "0018", client: "Maria Bethânia", date: "25/01/2025", total: "R$189,54", payment: "Crédito", status: "Processando" },
    { id: "0019", client: "William Bonner", date: "25/01/2025", total: "R$891,50", payment: "Débito", status: "Pago" },
    { id: "0020", client: "Tata Werneck", date: "20/01/2025", total: "R$300,00", payment: "Pix", status: "Pago" },
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, paymentFilter]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchField === "client" 
      ? transaction.client.toLowerCase().includes(searchQuery.toLowerCase())
      : transaction.date.includes(searchQuery);
    
    const matchesStatus = statusFilter === "Todos" || transaction.status === statusFilter;
    const matchesPayment = paymentFilter === "Todos" || transaction.payment === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Resetamos a página quando o usuário muda a quantidade de itens
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
              <option value="Pago">Pago</option>
              <option value="Processando">Processando</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todos">Todos Pagamentos</option>
              <option value="Crédito">Crédito</option>
              <option value="Débito">Débito</option>
              <option value="Pix">Pix</option>
            </select>
          </div>
        </div>

        {/* Tabela de transações */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {["PEDIDO", "CLIENTE", "DATA", "TOTAL", "PAGAMENTO", "STATUS"].map((header) => (
                  <th key={header} className="p-3 text-sm font-medium text-gray-600 text-left">
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
              Mostrando {startIndex + 1}-{endIndex} de {totalItems}
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Itens por página:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-3 py-1 border rounded-lg"
              >
                <option value="2">2</option>
                <option value="5">5</option>
                {/* <option value="10">10</option> */}
              </select>
            </div>
          </div>

          {/* Paginação */}
          <div className="flex justify-center p-4 border-t">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 mx-1 border rounded bg-red-600 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 mx-1 border rounded ${currentPage === page ? "bg-red-600 text-white" : "bg-white"}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 mx-1 border rounded bg-red-600 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default TransactionList;