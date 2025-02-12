"use client";
import { useState } from "react";
import { ShoppingCart, Package, Menu, X } from "lucide-react";
import TransactionList from "./TransactionsList";
import StockPage from "./StockList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Sidebar = ({ activePage, setActivePage, isOpen, toggleMenu }: { activePage: string; setActivePage: (page: string) => void; isOpen: boolean; toggleMenu: () => void }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen overflow-y-auto w-64 bg-gray-100 p-4 shadow-lg transform transition-transform md:translate-x-0 z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:w-64 md:block`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Chrono Sports</h2>
        <button className="md:hidden" onClick={toggleMenu}>
          <X size={24} />
        </button>
      </div>
      <nav>
        <h3 className="mt-4 mb-2 text-sm text-gray-500">Menu</h3>
        <button
          onClick={() => { setActivePage("transactions"); toggleMenu(); }}
          className={`flex items-center gap-2 p-2 w-full text-left rounded transition ${
            activePage === "transactions" ? "bg-gray-200 font-bold" : "opacity-60 hover:bg-gray-200"
          }`}
        >
          <ShoppingCart size={20} /> Vendas
        </button>
        <h3 className="mt-4 mb-2 text-sm text-gray-500">Produtos</h3>
        <button
          onClick={() => { setActivePage("stock"); toggleMenu(); }}
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
    <div className="w-full p-4 md:p-6" style={{ backgroundColor: "#fafafa" }}>
      {activePage === "transactions" && <TransactionList />}
      {activePage === "stock" && <StockPage />}
    </div>
  );
};

const NewProfilePage = () => {
  const [activePage, setActivePage] = useState("transactions");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [queryClient] = useState(() => new QueryClient());
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen h-screen">
        <button className="md:hidden fixed top-4 left-4 z-50 bg-gray-200 p-2 rounded" onClick={toggleMenu}>
          <Menu size={24} />
        </button>
        <Sidebar activePage={activePage} setActivePage={setActivePage} isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <div className="flex-1 md:pl-64">
          <Content activePage={activePage} />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default NewProfilePage;
