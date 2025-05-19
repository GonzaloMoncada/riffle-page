export type NumberRiffle = {
  id: number;
  name: string;
  confirmation: boolean;
  paid: boolean;
};

export type UpdateItem = {
  id?: number;
  confirmation?: boolean;
  name?: string;
  paid?: boolean;
};
type DeleteRiffleResponse = { message: string };

//get numbers from api
export async function getNumbers(): Promise<NumberRiffle[]> {
  const res = await fetch('/api/riffle');
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

//put numbers to api
export async function updateNumber(body: UpdateItem): Promise<void> {
  if(!body.id) return;
  const res = await fetch('/api/riffle', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  
}

export async function deleteRiffle(): Promise<DeleteRiffleResponse> {
  const res = await fetch('/api/riffle', { method: 'DELETE' });

  if (!res.ok) throw new Error(`Error ${res.status}`);

  return await res.json(); 
}
