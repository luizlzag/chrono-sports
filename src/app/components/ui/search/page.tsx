"use client";
import React from "react";
import { MdOutlineSearch } from "react-icons/md";

function SearchItem() {
    return ( 
        <div className="flex justify-center items-center mx-3 pt-6 mb-6">
            <input className="shadow-md bg-white text-black  rounded-s-md " placeholder=" Procurar item..."/>
            <MdOutlineSearch  className="bg-red-600 rounded-e-md text-white shadow-md " size={24} />
        </div>
     );
}

export default SearchItem;