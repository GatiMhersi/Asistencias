
import { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';

const toObjectId = (id: string): any => {
  if (!id) return null;
  try {
    // Solo convertimos si tiene el formato de 24 caracteres hex de MongoDB
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return new ObjectId(id);
    }
    return id;
  } catch (e) {
    return id;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Aseguramos que siempre respondamos con JSON
  res.setHeader('Content-Type', 'application/json');

  try {
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
        if (!_id) return res.status(400).json({ error: 'Falta ID del curso' });
        
        await collection.updateOne(
          { _id: toObjectId(_id) },
          { $set: updateData }
        );
        return res.status(200).json({ message: 'Curso actualizado' });

      case 'DELETE':
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'Falta ID del curso' });
        
        await collection.deleteOne({ _id: toObjectId(id as string) });
        return res.status(200).json({ message: 'Curso eliminado' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Método ${req.method} no permitido` });
    }
  } catch (error: any) {
    console.error('Error en api/courses:', error);
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}
