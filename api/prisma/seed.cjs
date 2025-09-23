const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const priority = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  LOWEST: 4,
  NONE: 5,
}

const groceryItems = [
  {
    name: 'Apples',
    quantity: 0,
    priority: priority.HIGH,
  },
  {
    name: 'Bananas',
    quantity: 0,
    priority: priority.HIGH,
  },
  {
    name: 'Bread',
    quantity: 0,
    priority: priority.MEDIUM,
  },
  {
    name: 'Milk',
    quantity: 0,
    priority: priority.LOW,
  },
  {
    name: 'Eggs',
    quantity: 0,
    priority: priority.LOWEST,
  },
  {
    name: 'Lettuce',
    quantity: 0,
    priority: priority.NONE,
  },
  {
    name: 'Tomato',
    quantity: 0,
    priority: priority.LOW,
  },
  {
    name: 'Potatoes',
    quantity: 0,
    priority: priority.MEDIUM,
  },
]

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'testuser@example.com' },
    update: {},
    create: {
      email: 'testuser@example.com',
      password: 'testpassword',
    },
  })

  // Create grocery items with userId
  await Promise.all(
    groceryItems.map(item =>
      prisma.groceryItem.create({
        data: {
          ...item,
          userId: user.id, // Associate with the test user
        },
      }),
    ),
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
