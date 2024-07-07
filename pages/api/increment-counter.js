import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Increment visitor count in database
      const updatedCount = await prisma.visitorCount.update({
        where: { id: 1 }, // Assuming there's only one row in the visitorCount table
        data: { count: { increment: 1 } },
      });

      res.status(200).json({ count: updatedCount.count });
    } catch (error) {
      console.error('Error updating visitor count:', error);
      res.status(500).json({ error: 'Failed to increment visitor count.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
