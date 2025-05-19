import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Db } from 'mongodb'


async function initializeIfEmpty(db: Db) {
  const count = await db.collection('items').countDocuments()
  if (count === 0) {
    const initialDocs = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `Item ${i.toString().padStart(2, '0')}`,
      confirmation: false,
      paid: false,
    }))
    await db.collection('items').insertMany(initialDocs)
  }
}

export async function GET() {
  const { db } = await connectToDatabase()
  await initializeIfEmpty(db)

  const items = await db.collection('items').find().toArray()
  return NextResponse.json(items)
}

export async function DELETE() {
  try {
    const { db } = await connectToDatabase();

    // 1) Vaciar la colección
    await db.collection('items').deleteMany({});

    // 2) (Opcional) Para borrarla entera:
    // await db.collection('items').drop();

    // 3) (Opcional) Para borrar TODA la base:
    // await db.dropDatabase();

    return NextResponse.json({ message: 'Colección vaciada' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Error al eliminar datos' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { id, confirmation, name, paid } = await request.json();
  if (typeof id !== 'number') {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  if (
    (confirmation !== undefined && typeof confirmation !== 'boolean') ||
    (name          !== undefined && typeof name         !== 'string')  ||
    (paid          !== undefined && typeof paid         !== 'boolean')
  ) {
    return NextResponse.json({ error: 'Invalid data types' }, { status: 400 });
  }

  const updateFields: Partial<{
    confirmation: boolean;
    name: string;
    paid: boolean;
  }> = {};

  if (confirmation !== undefined) updateFields.confirmation = confirmation;
  if (name          !== undefined) updateFields.name         = name;
  if (paid          !== undefined) updateFields.paid         = paid;

  // Si no hay nada que actualizar, avisa al cliente
  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json({ message: 'No fields to update' }, { status: 200 });
  }

  // ────────────────────────────────────────────────
  // 5. Conexión a la BD y update
  const { db } = await connectToDatabase();

  const result = await db.collection('items').updateOne(
    { id },
    { $set: updateFields }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Updated successfully' });
}