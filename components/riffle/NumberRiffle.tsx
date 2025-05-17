'use client';
import { NumberRiffleProps } from "@/types/numberRiffle";
import { useState } from "react";

type Props = {
    number: NumberRiffleProps;
    onNumberClick: (id: number) => void;
}

export default function NumberRiffle({ number, onNumberClick }: Props) {
    const [focus, setFocus] = useState(number.confirmation);
    const handleClick = (number: NumberRiffleProps) => {
        setFocus(true);
        onNumberClick(number.id);
    }
    return (
        <button onClick={() => handleClick(number)} className={`cursor-pointer border border-gray-400 flex items-center justify-center text-black ${focus ? "bg-green-400" : "bg-white"}`}>
            {number.id}
        </button>
    )
}