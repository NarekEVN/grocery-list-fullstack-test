import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'
import { FilterGroceryDto } from './dto/filter.dto'
import { CreateGroceryDto, UpdateGroceryDto } from './dto/grocery.dto'
import { GroceryItemResponseDto } from './dto/grocery-response.dto';

@Injectable()
export class GroceryService {
  constructor(private readonly prisma: PrismaService) {}

  async filterGroceries(filter: FilterGroceryDto): Promise<GroceryItemResponseDto[]> {
    const PAGE_SIZE = Number(process.env.GROCERY_PAGE_SIZE) || 10;
  
    const page = filter.page || 1;
    const pageSize = filter.pageSize || PAGE_SIZE;

    const where = {
      ...(filter.priority && { priority: filter.priority }),
      ...(filter.status && { status: filter.status }),
    };
    const groceries = await this.prisma.groceryItem.findMany({
      where,
      orderBy: [{ priority: 'asc' }, { name: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
  
    return groceries;
  }

  async createGrocery(createGroceryDto: CreateGroceryDto): Promise<GroceryItemResponseDto> {
    return this.prisma.groceryItem.create({ data: createGroceryDto })
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

}
