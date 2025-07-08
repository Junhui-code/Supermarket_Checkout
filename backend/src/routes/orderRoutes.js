import express from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const prisma = new PrismaClient();

// Create new order
router.post('/', async (req, res) => {
  const { items, deliveryType, address } = req.body;
  
  try {
    // Validate input
    if (!items || !deliveryType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate total and validate stock
    let total = 0;
    for (const item of items) {
      const product = await prisma.product.findUnique({ 
        where: { id: item.productId } 
      });
      
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
      
      total += product.price * item.quantity;
    }

    if (deliveryType === 'DELIVERY') total += 4.0;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          id: uuidv4(),
          total,
          deliveryType,
          address: deliveryType === 'DELIVERY' ? address : null,
          items: {
            create: items.map(item => ({
              id: uuidv4(),
              quantity: item.quantity,
              product: { connect: { id: item.productId } }
            }))
          }
        },
        include: { items: true }
      });

      // Update stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return order;
    });

    res.status(201).json({ 
      orderId: order.id, 
      total: order.total,
      message: "Order created successfully"
    });
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ error: 'Order creation failed' });
  }
});

export default router;