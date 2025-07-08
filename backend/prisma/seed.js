const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    // Reset all data
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()

    // Create sample products
    await prisma.product.createMany({
      data: [
        { 
          name: 'Organic Milk', 
          description: 'Fresh organic milk',
          price: 3.99,
          stock: 50,
          category: 'Dairy'
        },
        // ... other products
      ],
    })
    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()