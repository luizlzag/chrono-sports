"use client";
import React, { useState } from "react";
import { login } from "../../../../api/axios/api";
import { useRouter } from "next/navigation";

function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response: { token?: string; message?: string } = await login(email, password);

        if (response.token) {
            localStorage.setItem("token", response.token);
            router.push("/pages/home");
        } else {
            setError(response.message);
        }
    };

    return (
        <div className="bg-black flex flex-col justify-start items-center px-4 mt-10">
            <div className="w-full max-w-sm">
                <div className="flex justify-center mb-3">
                <img src="/logo.png" alt="Logo da Marca" width={150} height={150} />
                </div>
                <h1 className="text-white text-2xl font-bold text-center mb-8">
                Bem-vindo de volta!
                </h1>
                <form className="bg-white shadow-md rounded-lg px-8 py-6" onSubmit={handleSubmit}>
                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-red-600 text-sm font-bold mb-2">
                    Email
                    </label>
                    <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Insira seu email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-red-600 text-sm font-bold mb-2">
                    Senha
                    </label>
                    <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline animate-pulse-red">
                    Entrar
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
