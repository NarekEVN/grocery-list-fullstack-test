import { GroceryItemStatus } from '@prisma/client'

export const groceryItemFixtures = [
  { id: '11111111-1111-4111-8111-111111111111', name: 'Milk', priority: 1, status: GroceryItemStatus.HAVE },
  { id: '22222222-2222-4222-8222-222222222222', name: 'Bread', priority: 2, status: GroceryItemStatus.RANOUT },
  { id: '33333333-3333-4333-8333-333333333333', name: 'Eggs', priority: 3, status: GroceryItemStatus.HAVE },
  { id: '44444444-4444-4444-8444-444444444444', name: 'Cheese', priority: 4, status: GroceryItemStatus.RANOUT },
  { id: '55555555-5555-4555-8555-555555555555', name: 'Butter', priority: 5, status: GroceryItemStatus.HAVE },
]
