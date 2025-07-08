import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Update stock after purchase
router.patch('/:id/stock', async (req, res) => {
  const { quantity } = req.body;
  
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { stock: { decrement: quantity } }
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Stock update failed' });
  }
});

export default router;