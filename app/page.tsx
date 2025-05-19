'use client';
import NumberRiffle from "@/components/riffle/NumberRiffle";
import { useEffect, useState } from "react";
import { NumberRiffleProps } from "@/types/numberRiffle";
import { deleteRiffle, getNumbers, updateNumber } from "@/lib/riffleService";
type UpdateItem = { id: number; confirmation: boolean, paid: boolean }
type numberSelect = { name: string; id?: number, paid: boolean };
export default function Home() {
  const [numbers, setNumbers] = useState<NumberRiffleProps[]>([]);
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [numberSelected, setNumberSelected] = useState<numberSelect>({ id: undefined, name: "Ninguno Seleccionado", paid: false });

  function Spinner() {
    return (
      <div className="col-span-full row-span-full flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }
  const copyLeft = () => {
    console.log(numbers.filter(number => !number.confirmation));
    const numbersLeft = numbers.filter(number => !number.confirmation);
    const idsText = numbersLeft.map(n => n.id).join('_');
    console.log(idsText);
    navigator.clipboard.writeText(idsText).catch(err =>
      console.error('Error al copiar:', err)
    );
  }
  const deleteRiffleAll = async () => {
    await deleteRiffle();
    location.reload();
  }
  const handleDelete = async () => {
    const toSend = { id: numberSelected.id, paid: false, confirmation: false }
    await updateNumber(toSend);
    if (toSend.id) {
      setNumbers(prev =>
        prev.map((item, idx) =>
          idx === numberSelected.id
            ? { ...item, confirmation: false, paid: false }
            : item
        )
      );

      setNumberSelected({ id: undefined, name: "Ninguno Seleccionado", paid: false })
    }
  }
  const handleSelected = (id: number) => {
    setNumberSelected({ id: id, name: numbers[id].name, paid: numbers[id].paid });
  }
  const handlePaid = async () => {
    try {
      const toSend = { id: numberSelected.id, paid: !numberSelected.paid }
      await updateNumber(toSend);
      if (toSend.id) {
        setNumberSelected(prev =>
          prev
            ? { ...prev, paid: !prev.paid }
            : prev
        );
      }
      setNumbers(prev =>
        prev.map((item, idx) =>
          idx === numberSelected.id
            ? { ...item, paid: !numbers[numberSelected.id].paid }
            : item
        )
      );
    } catch {
      alert('Error al confirmar')
    }
  }
  // get numbers from api
  useEffect(() => {
    (async () => {
      try {
        const data = await getNumbers();
        setNumbers(data);
        console.log(data);

      } catch {
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
        return [...prev, { id, confirmation: true, paid: false }]
      }
      // If exists
      const newPrev = [...prev]
      newPrev[idx] = { ...newPrev[idx], confirmation: !newPrev[idx].confirmation }
      return newPrev
    }
    )
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) return alert('Ingresa un nombre')
    try {
      const toSend = updates.filter(u => u.confirmation).map(u => ({ ...u, name }));
      await Promise.all(toSend.map(updateNumber));
      const map = new Map(toSend.map(u => [u.id, u]));

      setNumbers(prev =>
        prev.map(item =>
          map.has(item.id) ? { ...item, ...map.get(item.id)! } : item
        )
      );
      setUpdates([]);
      setName('');
    } catch {
      alert('Error al confirmar')
    }
  }
  return (
    <div className="overflow-y-hidden flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:relative border md:p-4 border-gray-300 rounded-lg h-screen md:h-[80vh] shadow-lg bg-white md:w-[70vw] w-full">
        <div className="flex w-full justify-end items-center px-2 pt-2 md:absolute md:top-10 md:justify-start md:w-full md:m-2">
          <button onClick={deleteRiffleAll} className="w-8 h-8 md:w-14 md:h-14 cursor-pointer md:flex md:items-center md:gap-2">
            <img src="/icons/refresh-square.svg" alt="" />
            <span className="hidden md:block md:text-2xl md:font-semibold"> Reiniciar</span>
          </button>

        </div>
        <main className="p-4 h-3/4 md:w-full grid grid-cols-10 grid-rows-10">
          {loading ? (
            /* El spinner cubre la cuadrícula, pero sin desmontarla */
            <Spinner />
          ) : (
            numbers.map(number => (
              <NumberRiffle
                key={number.id}
                number={number}
                onNumberClick={handleNumberClick}
                onSelect={handleSelected}
              />
            ))
          )}
        </main>
        <aside className="flex justify-center items-center flex-col border-t md:border-none md:p-0 md:w-1/4 border-gray-200 p-4 gap-2">
          <form onSubmit={handleSubmit} className="flex justify-center w-full items-center flex-col gap-2">
            <div className="flex flex-row justify-around md:justify-between w-full items-center">
              <span className="font-bold w-1/4">
                {numbers.filter(number => number.confirmation).length + '/100'}
              </span>
              <input required type="text" name="" id="" placeholder="Juan" className="p-2 border border-gray-500 max-h-10"
                onChange={e => setName(e.target.value)}
                value={name}
              />
              <div className="w-1/4 flex items-center justify-center">
                <button onClick={copyLeft} type="button" className="cursor-pointer flex flex-col text-sm h-6 w-6"><img src="/icons/copy.svg" className="" alt="" /></button>
              </div>
            </div>
            <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Confirmar</button>
          </form>
          <div className="w-full flex flex-row justify-between items-center"><span className="font-semibold">Detalles del numero:</span><button type="button" onClick={handleDelete} className="w-5 h-5"><img src="/icons/delete.svg" alt="delete" /></button></div>
          <div className="flex flex-row gap-2 w-full items-center">
            <div className="p-4 w-1/10 border border-gray-400 bg-gray-400 flex items-center justify-center text-white">
              {numberSelected.id}
            </div>
            {numberSelected.name}
            <button onClick={handlePaid} className={` cursor-pointer ml-auto p-3 md:whitespace-nowrap rounded-xl text-white font-bold ${numberSelected.paid ? 'bg-green-500' : 'bg-gray-500'
              }`}>{numberSelected.paid ? "Pagado" : "Sin pagar"}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
