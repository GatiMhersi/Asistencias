
import { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db('colegio');
  const collection = db.collection('rubrics');

  if (req.method === 'POST') {
    const rubric = req.body;
    await collection.insertOne(rubric);
    return res.status(201).json(rubric);
  }

  if (req.method === 'GET') {
    const rubrics = await collection.find({}).sort({ _id: -1 }).toArray();
    return res.status(200).json(rubrics);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
