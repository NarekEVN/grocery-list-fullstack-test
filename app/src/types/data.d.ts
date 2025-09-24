interface GroceryItem {
  id: string
  name: string
  quantity?: number
  priority?: number
  status?: 'HAVE' | 'RANOUT'
  createdAt?: string
  updatedAt?: string
  lastUpdatedStatus?: string | null
}

interface GroceryFormItem {
  name: string
  quantity?: number
  priority: 1 | 2 | 3 | 4 | 5
}

interface GroceryHistoryEntry {
  id: string
  newStatus: 'HAVE' | 'RANOUT'
  changedAt: string
}
