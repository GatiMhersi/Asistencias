
import { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db('colegio');
  const collection = db.collection('attendance');

  switch (req.method) {
    case 'GET':
      const history = await collection.find({}).sort({ _id: -1 }).toArray();
      return res.status(200).json(history);

    case 'POST':
      const record = req.body;
      await collection.insertOne(record);
      return res.status(201).json(record);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
