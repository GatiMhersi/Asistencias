
import { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db('colegio');
  const collection = db.collection('courses');

  switch (req.method) {
    case 'GET':
      const courses = await collection.find({}).toArray();
      return res.status(200).json(courses);

    case 'POST':
      const newCourse = req.body;
      const result = await collection.insertOne(newCourse);
      return res.status(201).json({ ...newCourse, _id: result.insertedId });

    case 'PUT':
      const { _id, ...updateData } = req.body;
      await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData }
      );
      return res.status(200).json({ message: 'Curso actualizado' });

    case 'DELETE':
      const { id } = req.query;
      await collection.deleteOne({ _id: new ObjectId(id as string) });
      return res.status(200).json({ message: 'Curso eliminado' });

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
