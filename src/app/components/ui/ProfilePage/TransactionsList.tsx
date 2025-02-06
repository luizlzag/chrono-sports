"use client";
import { useState } from "react";
import { ChevronDown, Circle } from "lucide-react";

// Componente para exibir o status de pagamento
const StatusBadge = ({ status }: { status: string }) => {
  const statusColors: Record<string, string> = {
    "Pago": "bg-green-200 text-green-800",
    "Processando": "bg-yellow-200 text-yellow-800",
  };

  return (
    <span className={`px-2 py-1 text-sm rounded ${statusColors[status] || "bg-gray-200 text-gray-800"}`}>
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
  status
}: {
  id: string;
  client: string;
  date: string;
  total: string;
  payment: string;
  status: string;
}) => {
  return (
    <tr className="border-b hover:bg-gray-100 text-center text-[#23272e]">
      <td className="p-3">#{id}</td>
      <td className="p-3">{client}</td>
      <td className="p-3">{date}</td>
      <td className="p-3 font-medium">{total}</td>
      <td className="p-3">{payment}</td>
      <td className="p-3">
        <StatusBadge status={status} />
      </td>
      <td className="p-3 text-red-500 cursor-pointer">
        <Circle size={18} />
      </td>
    </tr>
  );
};


const TransactionList = () => {
    const transactions = [
        { id: "0001", client: "Caetano Veloso", date: "29/01/2025", total: "R$300,00", payment: "Crédito", status: "Processando" },
        { id: "0002", client: "Maria Bethânia", date: "25/01/2025", total: "R$189,54", payment: "Crédito", status: "Processando" },
        { id: "0003", client: "William Bonner", date: "25/01/2025", total: "R$891,50", payment: "Débito", status: "Pago" },
        { id: "0004", client: "Tata Werneck", date: "20/01/2025", total: "R$300,00", payment: "Pix", status: "Pago" },
    ];
  
    return (
        <>
            <h2 className="text-xl font-bold mb-9">Gestão de Pedidos</h2>
            <div className="overflow-x-auto bg-white rounded shadow-md">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="border-b p-3 text-center text-[#8b909a]">
                        <th className="p-3 font-normal">Nº DO PEDIDO</th>
                        <th className="p-3 font-normal">CLIENTE</th>
                        <th className="p-3 font-normal">DATA</th>
                        <th className="p-3 font-normal">TOTAL</th>
                        <th className="p-3 font-normal">PAGAMENTO</th>
                        <th className="p-3 font-normal">SITUAÇÃO</th>
                        <th className="p-3 font-normal">VER DETALHES</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((transaction) => (
                        <TransactionItem key={transaction.id} {...transaction} />
                    ))}
                    </tbody>
                    <tfoot>
                        <tr className="flex justify-between text-center p-3">
                            <span className="text-[#8b909a]">
                                Mostrando
                            </span>
                            <select name="" id="" className="border rounded p-1">
                                <option value="5">5</option>
                                <option value="10">10</option>
                            </select>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
};
  

export default TransactionList;
