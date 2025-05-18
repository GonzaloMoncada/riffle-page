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

export async function PUT(request: Request) {
  const { id, confirmation, name } = await request.json()

  if (typeof id !== 'number' || typeof confirmation !== 'boolean' || (name !== undefined && typeof name !== 'string')) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const { db } = await connectToDatabase()

  const updateFields: { confirmation?: boolean; name?: string } = { confirmation }
  if (name !== undefined) {
    updateFields.name = name
  }

  const result = await db.collection('items').updateOne(
    { id },
    { $set: updateFields }
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Updated successfully' })
}
