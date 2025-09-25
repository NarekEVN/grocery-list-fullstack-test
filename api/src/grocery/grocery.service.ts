import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'
import { FilterGroceryDto } from './dto/filter.dto'
import { CreateGroceryDto, UpdateGroceryDto } from './dto/grocery.dto'
import { GroceryItemResponseDto, StatusHistoryResponseDto } from './dto/grocery-response.dto'

@Injectable()
export class GroceryService {
  constructor(private readonly prisma: PrismaService) {}

  async filterGroceries(filter: FilterGroceryDto, userId: string): Promise<GroceryItemResponseDto[]> {
    const PAGE_SIZE = 10

    const page = filter.page || 1
    const pageSize = filter.pageSize || PAGE_SIZE

    const where = {
      userId,
      ...(filter.priority && { priority: filter.priority }),
      ...(filter.status && { status: filter.status }),
    }
    const groceries = await this.prisma.groceryItem.findMany({
      where,
      include: {
        statusHistory: true,
      },
      orderBy: [{ priority: 'asc' }, { name: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return groceries.map(grocery => {
      const lastUpdatedStatus = grocery.statusHistory[grocery.statusHistory.length - 1]?.changedAt.toISOString() || null;

      const { statusHistory, ...items } = grocery

      return {
        ...items,
        lastUpdatedStatus,
      }
    })
  }

  async createGrocery(createGroceryDto: CreateGroceryDto, userId: string): Promise<GroceryItemResponseDto> {
    return this.prisma.groceryItem.create({ data: { ...createGroceryDto, userId } })
  }

  async updateGrocery(id: string, updateGroceryDto: UpdateGroceryDto): Promise<GroceryItemResponseDto> {
    const currentGrocery = await this.prisma.groceryItem.findUnique({
      where: { id },
    })

    if (!currentGrocery) {
      throw new NotFoundException(`Grocery item not found`)
    }

    const updatedGrocery = await this.prisma.groceryItem.update({
      where: { id },
      data: updateGroceryDto,
    })
    if (updateGroceryDto.status && updateGroceryDto.status !== currentGrocery.status) {
      await this.prisma.groceryItemStatusHistory.create({
        data: {
          groceryItemId: id,
          oldStatus: currentGrocery.status,
          newStatus: updateGroceryDto.status,
        },
      })
    }
    return updatedGrocery
  }

  async deleteGrocery(id: string) {
    const currentGrocery = await this.prisma.groceryItem.findUnique({
      where: { id },
    })

    if (!currentGrocery) {
      throw new NotFoundException(`Grocery item not found`)
    }

    return this.prisma.groceryItem.delete({
      where: { id },
    })
  }

  async getGroceryItemById(id: string): Promise<GroceryItemResponseDto> {
    const groceryItem = await this.prisma.groceryItem.findUnique({
      where: { id },
    })

    if (!groceryItem) {
      throw new NotFoundException(`Grocery item not found`)
    }

    return groceryItem
  }

  async getGroceryItemHistory(id: string): Promise<StatusHistoryResponseDto[]> {
    const history = await this.prisma.groceryItemStatusHistory.findMany({
      where: { groceryItemId: id },
      orderBy: { changedAt: 'desc' },
    })
    const data = history.map(item => ({
      id: item.id,
      groceryItemId: item.groceryItemId,
      oldStatus: item.oldStatus,
      newStatus: item.newStatus,
      changedAt: item.changedAt.toISOString(),
    }))

    return data
  }
}
