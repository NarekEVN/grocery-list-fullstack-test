import { GroceryItemStatus } from '@prisma/client'

export class GroceryItemResponseDto {
  id: string
  name: string
  priority: number | null
  status: GroceryItemStatus
  createdAt: Date
  updatedAt: Date
}

export class GroceryItemWithHistoryResponseDto extends GroceryItemResponseDto {
  statusHistory: StatusHistoryResponseDto[]
}

export class StatusHistoryResponseDto {
  id: string
  groceryItemId: string
  oldStatus: GroceryItemStatus | null
  newStatus: GroceryItemStatus
  changedAt: Date
}

export class GroceryListResponseDto {
  data: GroceryItemResponseDto[]
}

export class GroceryItemDetailResponseDto {
  data: GroceryItemWithHistoryResponseDto
}

export class GroceryStatusHistoryResponseDto {
  data: StatusHistoryResponseDto[]
}
