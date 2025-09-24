import { useMutation, useQuery } from '@tanstack/react-query'

import {
  createGroceryItem,
  deleteGroceryItem,
  getGroceryById,
  getGroceryHistory,
  getGroceryList,
  updateGroceryItem,
} from '@services/grocery'
import { queryClient } from '@utils/client'

export const useGrocery = (id: string) =>
  useQuery({ queryKey: ['grocery', id], queryFn: () => getGroceryById(id), enabled: !!id })

export const useGroceryList = (params?: { priority?: number; status?: string; perPage?: number }, enabled = true) => {
  return useQuery({
    queryKey: ['groceryList', params],
    queryFn: () => getGroceryList({ ...(params ?? {}) }),
    enabled,
  })
}

export const useCreateGrocery = () => {
  return useMutation({
    mutationKey: ['createGrocery'],
    mutationFn: (groceryItem: GroceryFormItem) => createGroceryItem(groceryItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceryList'] })
    },
  })
}

export const useUpdateGrocery = () => {
  return useMutation({
    mutationKey: ['updateGrocery'],
    mutationFn: async ({ item }: { item: GroceryItem }) => {
      return updateGroceryItem({ ...item })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceryList'] })
    },
  })
}

export const useDeleteGrocery = () => {
  return useMutation({
    mutationKey: ['deleteGrocery'],
    mutationFn: (id: string) => deleteGroceryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceryList'] })
    },
  })
}

export const useGroceryHistory = (id: string) =>
  useQuery({ queryKey: ['groceryHistory', id], queryFn: () => getGroceryHistory(id), enabled: !!id })
