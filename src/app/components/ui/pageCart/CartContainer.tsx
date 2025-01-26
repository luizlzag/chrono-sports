"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import { IoMdAddCircle, IoMdCart, IoMdAdd, IoMdRemove, IoMdTrash } from "react-icons/io";
import { useRouter } from "next/navigation";
import { getProducts } from "@/api/axios/api";
import { useTransaction } from "@/context/TransactionContext";
import { Item } from "@/app/types/cartTypes";

const Itens: React.FC<{ addToCart: (item: Item) => void, searchTerm: string }> = ({ addToCart, searchTerm }) => {
    const [itensList, setItensList] = useState<Item[]>([]);  // Armazena os itens da API
    const [loading, setLoading] = useState<boolean>(true);   // Estado de carregamento
    const [error, setError] = useState<string | null>(null); // Estado de erro
    
    // Carregar produtos da API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts(); // Chama a API para obter a resposta
                const products = response.products; // Chama a API para obter produtos
               
                // Verifique se a resposta da API é um array
                if (Array.isArray(products)) {
                    setItensList(products); // Atualiza o estado com os produtos obtidos
                } else {
                    throw new Error("A resposta da API não é um array");
                }
            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
                setError("Erro ao carregar produtos"); // Trata erros
            } finally {
                setLoading(false); // Termina o carregamento
            }
        };

        fetchProducts();
    }, []);

    // Filtra itens com base no termo de busca
    const filteredItems = Array.isArray(itensList)
        ? itensList.filter((item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : []; // Garante que `itensList` é um array

    // Exibe uma mensagem de carregamento enquanto a requisição está em andamento
    if (loading) {
        return <p>Carregando produtos...</p>;
    }

    // Exibe uma mensagem de erro se houver falha na requisição
    if (error) {
        return <p>{error}</p>;
    }
    

    return (
        
        <div className="md:grid md:grid-cols-4 gap-4">
            {filteredItems.length > 0 ? filteredItems.map((i) =>
                <div className="flex" key={i.id}>
                    <div className="w-full rounded shadow py-3 px-3 mb-3 bg-white grid grid-cols-2">
                        <Image
                            src={i.imageUrl || '/logo.png'} // Usa a imagem da API ou uma default
                            alt={i.name}
                            width={80}
                            height={80}
                        />
                        <div className="bg-white">
                            <p className="font-semibold bg-white">{i.name}</p>
                            <p className="bg-red-600 px-2 py-2 rounded-md text-white font-semibold text-center text-lg">
                                <span className="font-thin text-sm">R$</span>{i.price}
                            </p>
                            <button
                                className="flex items-center gap-2 hover:text-green-700"
                                onClick={() => addToCart({ ...i, quantity: 1 })}
                            >
                                Vender item <IoMdAddCircle className="bg-white" size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">Nenhum item encontrado.</p>
            )}
        </div>
    );
};

const ItensCart: React.FC<{ openCart: boolean, setOpenCart: React.Dispatch<React.SetStateAction<boolean>> }> = ({ openCart, setOpenCart }) => {
    const [cartItems, setCartItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const { transaction, updateTransaction } = useTransaction();

    useEffect(() => {
        if (transaction) {
            setCartItems(transaction.cart);
        }
    }, [transaction]);

    const calculateTotal = (): number => {
        return cartItems.reduce((total, item) => total + (item.price * (item.quantity ?? 1)), 0);
    };

    const updateCart = async (updatedItems: Item[]) => {
        setLoading(true);
        if (!transaction) {
            alert("Erro ao atualizar carrinho: transação não encontrada.");
            setLoading(false);
            return;
        }
        await updateTransaction({ cart: updatedItems }, transaction?.id);
        setLoading(false);
    };

    const incrementQuantity = (itemId: string) => {
        const updatedItems = cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
        );
        setCartItems(updatedItems);
        updateCart(updatedItems);
    };

    const decrementQuantity = (itemId: string) => {
        const updatedItems = cartItems.map(item =>
            item.id === itemId && (item.quantity ?? 1) > 1 ? { ...item, quantity: (item.quantity ?? 1) - 1 } : item
        );
        setCartItems(updatedItems);
        updateCart(updatedItems);
    };

    const removeItem = (itemId: string) => {
        const updatedItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedItems);
        updateCart(updatedItems);
    };

    const router = useRouter();
    
    const handlePayment = () => {
        if (!transaction?.id) {
            alert("Carrinho vazio, por favor adicione itens ao carrinho antes de prosseguir.");
            return;
        }
        router.push('/pages/checkout');
    }

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
            </div>
        )
    }

    return (
        <>
            <div className="fixed rounded-full bottom-2 right-2 py-3 px-3 bg-red-700 opacity-90 hover:opacity-100 z-50 cursor-pointer">
                <IoMdCart size={24} color="white" onClick={() => setOpenCart(!openCart)} />
            </div>
            {openCart && (
                <div className="z-50">
                    <div className="fixed bottom-16 right-3 bg-white px-6 py-4 z-50 rounded-lg shadow-lg w-80">
                        <div className="grid grid-cols-1 gap-4">
                            {cartItems.length > 0 ? cartItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <h1 className="text-gray-800 font-medium">{item.name}</h1>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => decrementQuantity(item.id)} className="bg-gray-200 rounded p-1 hover:bg-gray-300">
                                            <IoMdRemove />
                                        </button>
                                        <p className="text-gray-800">{item.quantity}</p>
                                        <button onClick={() => incrementQuantity(item.id)} className="bg-gray-200 rounded p-1 hover:bg-gray-300">
                                            <IoMdAdd />
                                        </button>
                                    </div>
                                    <p className="text-gray-800 font-medium">{(item.price * (item.quantity ?? 1)).toFixed(2)}</p>
                                    <button onClick={() => removeItem(item.id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600">
                                        <IoMdTrash />
                                    </button>
                                </div>
                            )) : (
                                <p className="text-gray-500">O carrinho está vazio.</p>
                            )}
                        </div>
                        <div className="grid gap-4 pt-4 border-t border-gray-200">
                            <p className="font-bold text-right text-lg">Total: R${calculateTotal().toFixed(2)}</p>
                            <button onClick={handlePayment} className="px-4 py-2 bg-red-700 rounded text-white w-full hover:bg-red-800">PAGAMENTO</button>
                        </div>
                    </div>
                    <div onClick={() => setOpenCart(false)} className="bg-gray-700 opacity-30 fixed top-0 w-full h-full z-0"></div>
                </div>
            )}
        </>
    );
};

const CartContainer: React.FC = () => {
    const [openCart, setOpenCart] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const { transaction, updateTransaction, createTransaction } = useTransaction();

    const addToCart = (item: Item) => {
        setLoading(true);

        if (transaction === undefined) return;

        if (!transaction) {
            createTransaction({ cart: [item] });
            setOpenCart(true);
            setLoading(false);
            return;
        }

        let cart: Item[] = transaction.cart;

        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity ?? 1) + 1;
        } else {
            cart.push(item);
        }

        updateTransaction({ cart }, transaction.id);
        setOpenCart(true);
        setLoading(false);
    };

    return (
        <div className="container p-4 mx-auto mt-20 relative">
            {loading && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
                    </div>
                    <div className="fixed inset-0 z-40"></div> {/* Adicione esta linha */}
                </>
            )}
            <div className={`${loading ? 'opacity-50' : 'opacity-100'}`}>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar itens..."
                        className="w-full p-2 border rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Itens addToCart={addToCart} searchTerm={searchTerm} />
                <ItensCart openCart={openCart} setOpenCart={setOpenCart} />
            </div>
        </div>
    );    
};

export default CartContainer;
