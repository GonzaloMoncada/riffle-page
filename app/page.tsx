'use client';
import Image from "next/image";
import { numberRiffleData } from "@/data/numberRiffleData";
import NumberRiffle from "@/components/riffle/NumberRiffle";
import { useState } from "react";
import { NumberRiffleProps } from "@/types/numberRiffle";
import { log } from "node:console";

export default function Home() {
  const [numbers, setNumbers] = useState<NumberRiffleProps[]>(numberRiffleData);
  
  const handleNumberClick = (id: number) => {
    setNumbers(prevNumbers =>
      prevNumbers.map(number =>
        number.id === id ? { ...number, confirmation: !number.confirmation } : number
      )
    );
  };
  const handleConfirm = () => {
    //clone object in another variable
    const numbersToConfirm = numbers.map(number => ({ ...number }));
    console.log(numbersToConfirm);
  }
  return (
    <div className="overflow-y-hidden flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100">
      <div className="flex flex-col md:flex-row border border-gray-300 rounded-lg h-screen shadow-lg bg-white md:w-[70vw] w-full">
        <main className="p-4 h-3/4 grid grid-cols-10 grid-rows-10">
          {numberRiffleData.map((number) => (
            <NumberRiffle
              key={number.id}
              number={number}
              onNumberClick={handleNumberClick}
              onDelete={false}
            />
          ))}
        </main>
        <aside className="flex justify-center items-center flex-col border-t border-gray-200 p-4 gap-2">
          <input type="text" name="" id="" placeholder="Juan" className="p-2 border border-gray-500" />
          <button onClick={handleConfirm} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Confirmar</button>
        </aside>
      </div>
    </div>
  );
}
