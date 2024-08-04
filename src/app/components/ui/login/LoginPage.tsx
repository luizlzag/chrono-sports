import * as React from 'react';
import logo from '../../../../../public/logo.png';
import Image from 'next/image';

function LoginPage() {
    return ( 
        <div className=" bg-black flex flex-col justify-start items-center px-4 mt-10">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-3">
            <Image
                src={logo} 
                alt="Logo da Marca"
                width={150} 
                height={150} 
                />
          </div>
          <h1 className="text-white text-2xl font-bold text-center mb-8">
            Bem-vindo de volta!
          </h1>
          <form className="bg-white shadow-md rounded-lg px-8 py-6">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-red-600 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Insira seu email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-red-600 text-sm font-bold mb-2"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                placeholder="********"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline animate-pulse-red"
            >
              Entrar
            </button>
            </div>
            <div className="mt-4 text-center">
              <a
                href="#"
                className="inline-block align-baseline font-bold text-sm text-red-600 hover:text-red-700"
              >
                Esqueceu sua senha?
              </a>
            </div>
          </form>
        </div>
        <div className="mt-8 text-center">
          <p className="text-white text-sm">
            Não tem uma conta?{" "}
            <a
              href="#"
              className="text-red-600 font-bold hover:text-red-700"
            >
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
     );
}

export default LoginPage;