export type NumberRiffle = {
  id: number;
  name: string;
  confirmation: boolean;
};

export type UpdateItem = {
  id: number;
  confirmation: boolean;
  name: string;
};

//get numbers from api
export async function getNumbers(): Promise<NumberRiffle[]> {
  const res = await fetch('/api/riffle');
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

//put numbers to api
export async function updateNumber(body: UpdateItem): Promise<void> {
  const res = await fetch('/api/riffle', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}
