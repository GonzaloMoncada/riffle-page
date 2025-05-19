'use client';
import { NumberRiffleProps } from "@/types/numberRiffle";
import { useEffect, useState } from "react";

type Props = {
    number: NumberRiffleProps;
    onNumberClick: (id: number) => void;
    onSelect: (id: number) => void;
}

export default function NumberRiffle({ number, onNumberClick, onSelect }: Props) {
    const [focus, setFocus] = useState(false);

    useEffect(() => {
        setFocus(false);
    }, [number]);

    const handleClick = (number: NumberRiffleProps) => {
        setFocus(!focus);
        onNumberClick(number.id);
    }
    if (number.confirmation) {
        return (
            <button onClick={() => onSelect(number.id)} className={`border flex  justify-center flex-col w-full text-black ${number.paid ? "bg-green-500 text-white" : "border-gray-400 bg-gray-400"}`}>
                {number.id}<span className="truncate font-semibold text-sm text-white">
                    {number.name}
                </span>
            </button>
        )
    }

    return (
        <button onClick={() => handleClick(number)} className={`cursor-pointer border border-gray-400 flex items-center justify-center text-black ${focus ? "border-green-500 text-green-500" : "bg-white"}`}>
            {number.id}
        </button>
    )
}