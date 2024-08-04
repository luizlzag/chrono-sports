"use client";
import React, { useState, useEffect } from "react";
import { FaCoins, FaBoxes } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import Image from "next/image";
import perf from "../../../../../public/perf.jpg";
import chronoCoin from "../../../../../public/chronocoin-removebg-preview.png";
import BackButton from "../ButtonReturn/ButtonReturn";
import ChronoCoinsSection from "./ChronoCoins";
import ReferralsSection from "./ReferralsSection";
import { Tooltip, ClickAwayListener } from "@mui/material";

// Tipos para facilitar a tipagem futura com TypeScript
interface Reward {
  sales: number;
  reward: string;
}

interface StockItem {
  name: string;
  quantity: number;
}

interface ProfileData {
  totalSales: number;
  salesTarget: number;
  rewards: Reward[];
  commission: number;
  stockStatus: StockItem[];
}

interface GymReferral {
  name: string;
  commission: number;
  position: number;
  targetSales: number;
  nextPositionSales: number;
}

interface ProfileData {
  totalSales: number;
  salesTarget: number;
  rewards: Reward[];
  commission: number;
  stockStatus: StockItem[];
  referrals: GymReferral[]; // Novo campo para academias indicadas
}


export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Simula uma chamada à API para buscar os dados
  useEffect(() => {
    const fetchData = async () => {
      // Essa simulação pode ser substituída por uma chamada à API real
      const data: ProfileData = {
        totalSales: 40,
        salesTarget: 100,
        rewards: [
          { sales: 40, reward: "Bandagem" },
          { sales: 60, reward: "Luva" },
          { sales: 100, reward: "Camiseta" },
        ],
        commission: 2345,
        stockStatus: [
          { name: "Luva", quantity: 50 },
          { name: "Bandagem", quantity: 20 },
          { name: "Bocal", quantity: 5 },
        ],
        referrals: [
          {
            name: "Academia XYZ",
            commission: 150,
            position: 5,
            targetSales: 200,
            nextPositionSales: 50,
          },
          {
            name: "Academia ABC",
            commission: 200,
            position: 4,
            targetSales: 250,
            nextPositionSales: 0,
          },
        ],
      };
      setProfileData(data);
    };

    fetchData();
  }, []);

  const getProgressPercentage = (sales: number, target: number) =>
    (sales / target) * 100;

  if (!profileData) {
    return <div>Loading...</div>;
  }

  const currentGym = profileData.referrals.find(ref => ref.position === 5);
  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Image
            src={perf} 
            alt="Foto do Usuário"
            width={60}
            height={60}
            className="rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold text-black">Matheus</h1>
            <p className="text-gray-600">Força e Ação</p>
          </div>
        </div>
        {currentGym && (
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
              <Tooltip
                title={`Sua academia está em ${currentGym.position}º lugar em vendas. Venda mais ${currentGym.targetSales} e assuma o ${currentGym.position - 2}º lugar!`}
                arrow
                open={tooltipOpen}
                onClose={handleTooltipClose}
                disableHoverListener
                disableTouchListener
                PopperProps={{
                  disablePortal: true,
                }}
              >
                <button
                  className="text-red-600 flex items-center gap-2 justify-center"
                  onClick={handleTooltipOpen}
                >
                  <span className="font-bold">{currentGym.position}º</span>
                  <FaRankingStar size={24} />
                </button>
              </Tooltip>
            </div>
          </ClickAwayListener>
        )}
      </header>

      {/* Seção de Vendas */}
      <section className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-black">Vendas</h2>
            <p className="text-gray-600">Total de vendas realizadas</p>
          </div>
          <p className="text-2xl font-bold text-red-600">R$ 12.345,00</p>
        </div>
      </section>

      {/* Seção de Meta e Recompensas */}
      <section className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-black">Meta de Vendas</h2>
            <FaCoins className="text-gray-600" size={24} />
          </div>

          {/* Barra de Progresso */}
          <div className="relative w-full h-4 bg-gray-300 rounded-full mb-2">
            <div
              className="absolute top-0 left-0 h-4 bg-red-600 rounded-full"
              style={{
                width: `${getProgressPercentage(
                  profileData.totalSales,
                  profileData.salesTarget
                )}%`,
              }}
            ></div>

            {/* Indicadores de Recompensas */}
            {profileData.rewards.map((reward, index) => (
              <div
                key={index}
                className="absolute top-0 -mt-3 h-8 w-8 bg-blue-600 text-white text-xs font-bold flex items-center justify-center rounded-full"
                style={{
                  left: `${getProgressPercentage(reward.sales, profileData.salesTarget)}%`,
                  transform: "translateX(-50%)",
                }}
              >
                {reward.reward.charAt(0)}
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-600">
            <p>
              {profileData.totalSales} vendas realizadas de{" "}
              {profileData.salesTarget}.
            </p>
            <ul className="mt-2">
              {profileData.rewards.map((reward, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="font-bold text-black">{reward.sales}</span>
                  <span>{reward.reward}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Seção de Comissões */}
      <ChronoCoinsSection chronoCoins={69} minWithdrawal={100}/>


      {/* Seção de Indicação */}
      <ReferralsSection referrals={profileData.referrals} />

      {/* Seção de Status do Estoque */}
      <section className="mb-6 pb-20">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-black">Status do Estoque</h2>
            <FaBoxes className="text-gray-600" size={24} />
          </div>
          <div className="space-y-4">
            {profileData.stockStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <p className="text-gray-800">{item.name}</p>
                <p className="text-red-600">{item.quantity} Unidades</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <BackButton />
    </div>
  );
}
