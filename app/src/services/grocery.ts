import { api } from '@services/auth'

export const getGroceryById = async (id: string) => {
  const res = await api.get(`grocery/${id}`).json<{ data: GroceryItem }>()
  return res.data
}

export const getGroceryList = async (params: { priority?: number; status?: string; perPage?: number }) => {
  const searchParams = new URLSearchParams()
  console.log(params.status)
  if (params.status) searchParams.set('status', params.status)
  const response = await api.get('grocery', { searchParams }).json<{ data: GroceryItem[] }>()

  return response.data
}

export const createGroceryItem = async (groceryItem: GroceryFormItem) => {
  const response = await api.post('grocery', { json: groceryItem }).json<{ data: GroceryItem }>()

  return response.data
}

export const updateGroceryItem = async (item: GroceryItem) => {
  const res = await api.put(`grocery/${item.id}`, { json: item }).json<{ data: GroceryItem }>()
  return res.data
}

export const deleteGroceryItem = async (id: string) => {
  await api.delete(`grocery/${id}`)
}

export const getGroceryHistory = async (id: string) => {
  const res = await api.get(`grocery/${id}/history`).json<{ data: GroceryHistoryEntry[] }>()
  return res.data
}
