import Image from "next/image";
import React from "react";


const itensList = [
    {
        id:'1',
        img:'',
        name:'LUVA VERMELHA',
        price:105.90
    },
    {
        id:'2',
        img:'',
        name:'LUVA AZUL',
        price:105.90
    },
    {
        id:'3',
        img:'',
        name:'LUVA AZUL',
        price:105.90
    },
    {
        id:'3',
        img:'',
        name:'LUVA AZUL',
        price:105.90
    },
]


function Itens() {
    return ( 
        <div>
            {itensList.map((i)=>
            <div className="flex mx-3" key={i.id}>
                <div className="w-screen rounded shadow py-4 px-4 mb-3">
                    <Image 
                        src='/luvavermelha.png'
                        alt="luva vermelha"
                        width={80}
                        height={80}/>
                    <p className="font-semibold">{i.name}</p>
                    <p>{i.price}</p>
                </div>
            </div>
            )}
        </div>
     );
}

export default Itens;