import React from "react";
import { FaCoins } from "react-icons/fa";


interface GymReferral {
    name: string;
    commission: number;
  }
  

// Seção de Indicações de Academias
function ReferralsSection({ referrals }: { referrals: GymReferral[] }) {
    return (
      <section className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-black">Academias Indicadas</h2>
            <FaCoins className="text-gray-600" size={24} />
          </div>
          <div className="space-y-4">
            {referrals.map((referral, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <p className="text-gray-800 font-semibold">{referral.name}</p>
                <p className="text-green-600 font-bold">+ R$ {referral.commission},00</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  export default ReferralsSection;
  