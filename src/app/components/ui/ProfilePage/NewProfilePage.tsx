"use client";
import { useState } from "react";
import { ShoppingCart, Package } from "lucide-react";
import TransactionList from "./TransactionsList";

const Sidebar = ({ activePage, setActivePage }: { activePage: string; setActivePage: (page: string) => void }) => {
  return (
    <aside className="w-64 h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-6">Chrono Sports</h2>
      <nav>
        <h3 className="mt-4 mb-2 text-sm text-gray-500">Menu</h3>
        <button
          onClick={() => setActivePage("transactions")}
          className={`flex items-center gap-2 p-2 w-full text-left rounded transition ${
            activePage === "transactions" ? "bg-gray-200 font-bold" : "opacity-60 hover:bg-gray-200"
          }`}
        >
          <ShoppingCart size={20} /> Vendas
        </button>

        <h3 className="mt-4 mb-2 text-sm text-gray-500">Produtos</h3>
        <button
          onClick={() => setActivePage("stock")}
          className={`flex items-center gap-2 p-2 w-full text-left rounded transition ${
            activePage === "stock" ? "bg-gray-100 font-bold" : "opacity-60 hover:bg-gray-200"
          }`}
        >
          <Package size={20} /> Estoque
        </button>
      </nav>
    </aside>
  );
};

const Content = ({ activePage }: { activePage: string }) => {
    return (
      <>
        {activePage === "transactions" && (
          <div className="w-full shadow-md" style={{ backgroundColor: "#fafafa" }}>
            <TransactionList />
          </div>
        )}
        {activePage === "stock" && <p>Estoque em breve...</p>}
      </>
    );
};

export const ProfilePage = () => {
  const [activePage, setActivePage] = useState("transactions");

  return (
    <div className="flex h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <Content activePage={activePage} />
    </div>
  );
}

export default ProfilePage;