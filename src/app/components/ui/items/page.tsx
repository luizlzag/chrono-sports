"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { getProducts } from "@/api/axios/api"; // Importa a função da API

type Item = {
  id: string;
  img: string;
  name: string;
  price: number;
};

function Itens() {
  const [itensList, setItensList] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar os produtos da API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setItensList(products); // Atualiza a lista de itens com os produtos da API
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar produtos");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Função para adicionar ao carrinho
  const addToCart = (item: Item) => {
    const cartData = localStorage.getItem("cart");
    let cart: Item[] = cartData ? JSON.parse(cartData) : [];
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  if (loading) {
    return <p>Carregando produtos...</p>; // Exibe uma mensagem enquanto carrega
  }

  if (error) {
    return <p>{error}</p>; // Exibe mensagem de erro se houver falha na requisição
  }

  return (
    <div className="md:grid md:grid-cols-4">
      {itensList.map((i) => (
        <div className="flex mx-3" key={i.id}>
          <div className="w-screen rounded shadow py-3 px-3 mb-3 bg-white grid grid-cols-2">
            <Image
              src={i.img || "/luvavermelha.png"} // Usa a imagem da API ou uma default
              alt={i.name}
              width={80}
              height={80}
            />
            <div className="bg-white">
              <p className="font-semibold bg-white">{i.name}</p>
              <p className="bg-red-600 px-2 py-2 rounded-md text-white font-semibold text-center text-lg">
                <span className="font-thin text-sm">R$</span>
                {i.price}
              </p>
              <button
                className="flex items-center gap-2 hover:text-green-700"
                onClick={() => addToCart(i)}
              >
                Adicionar item <IoMdAddCircle className="bg-white" size={24} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Itens;
