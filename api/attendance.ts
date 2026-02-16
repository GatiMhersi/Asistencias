
import { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const client = await clientPromise;
    const db = client.db('colegio');
    const collection = db.collection('attendance');

    switch (req.method) {
      case 'GET':
        const history = await collection.find({}).sort({ _id: -1 }).toArray();
        return res.status(200).json(history);

      case 'POST':
        const record = req.body;
        const result = await collection.insertOne(record);
        return res.status(201).json({ ...record, _id: result.insertedId });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error: any) {
    console.error('Error in api/attendance:', error);
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}
