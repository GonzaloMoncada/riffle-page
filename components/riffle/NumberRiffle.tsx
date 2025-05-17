'use client';
import { NumberRiffleProps } from "@/types/numberRiffle";
import { useState } from "react";

type Props = {
    number: NumberRiffleProps;
    onNumberClick: (id: number) => void;
    onDelete: boolean;
}

export default function NumberRiffle({ number, onNumberClick, onDelete}: Props) {
    const [focus, setFocus] = useState(number.confirmation);
    const handleClick = (number: NumberRiffleProps) => {
        if (onDelete){

        }
        else{
            setFocus(!focus);
            onNumberClick(number.id);
        }
    }
    if(onDelete){
        return (
            <button>
                algo
            </button>
        )
        
    }else
    if (number.confirmation) {
        return (
            <button className={`border border-gray-400 bg-gray-400 flex items-center justify-center text-black`}>
                {number.id}
            </button>
        )
    }

    return (
        <button onClick={() => handleClick(number)} className={`cursor-pointer border border-gray-400 flex items-center justify-center text-black ${focus ? "bg-green-400" : "bg-white"}`}>
            {number.id}
        </button>
    )
}