'use client';
import NumberRiffle from "@/components/riffle/NumberRiffle";
import { useEffect, useState } from "react";
import { NumberRiffleProps } from "@/types/numberRiffle";
import { getNumbers, updateNumber } from "@/lib/riffleService";
type UpdateItem = { id: number; confirmation: boolean }

export default function Home() {
  const [numbers, setNumbers] = useState<NumberRiffleProps[]>([]);
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('');

  // get numbers from api
  useEffect(() => {
    (async () => {
      try {
        const data = await getNumbers();
        setNumbers(data);
      } catch (err: any) {
        setError(err.message ?? 'Error fetching data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const handleNumberClick = (id: number) => {
    setUpdates(prev => {
      //check if id exists in updates
      const idx = prev.findIndex(u => u.id === id)
      //else if not exists add it
      if (idx === -1) {
        return [...prev, { id, confirmation: true }]
      }
      // If exists
      const newPrev = [...prev]
      newPrev[idx] = { ...newPrev[idx], confirmation: !newPrev[idx].confirmation }
      return newPrev
    })
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) return alert('Ingresa un nombre')
    try {
      const toSend = updates.filter(u => u.confirmation).map(u => ({ ...u, name }));
      console.log(toSend);
      await Promise.all(toSend.map(updateNumber));
      setName('');
      location.reload();
    } catch {
      alert('Error al confirmar')
    }
  }
  return (
    <div className="overflow-y-hidden flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100">
      <div className="flex flex-col md:flex-row border border-gray-300 rounded-lg h-screen shadow-lg bg-white md:w-[70vw] w-full">
        <main className="p-4 h-3/4 grid grid-cols-10 grid-rows-10">
          {numbers.map((number) => (
            <NumberRiffle
              key={number.id}
              number={number}
              onNumberClick={handleNumberClick}
              onDelete={false}
            />
          ))}
        </main>
        <aside className="flex justify-center items-center flex-col border-t border-gray-200 p-4 gap-2">
          <form onSubmit={handleSubmit} className="flex justify-center items-center flex-col gap-2">
            <input required type="text" name="" id="" placeholder="Juan" className="p-2 border border-gray-500"
              onChange={e => setName(e.target.value)}
              value={name}
            />
            <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Confirmar</button>
          </form>
        </aside>
      </div>
    </div>
  );
}
