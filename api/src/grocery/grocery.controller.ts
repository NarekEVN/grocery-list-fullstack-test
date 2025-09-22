import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { GroceryService } from './grocery.service'
import { FilterGroceryDto } from './dto/filter.dto'
import { CreateGroceryDto, GroceryItemIdDto, UpdateGroceryDto } from './dto/grocery.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller({
  version: '1',
  path: 'grocery',
})
@UseGuards(JwtAuthGuard)
export class GroceryController {
  constructor(private readonly groceryService: GroceryService) {}

  @Get()
  async filterGroceries(@Query() filter: FilterGroceryDto) {
    const data = await this.groceryService.filterGroceries(filter)

    return {
      data,
    }
  }

  @Post()
  async createGrocery(@Body() createGroceryDto: CreateGroceryDto) {
    const data = await this.groceryService.createGrocery(createGroceryDto)

    return {
      data,
    }
  }

  @Put(':id')
  async updateGrocery(@Param() { id }: GroceryItemIdDto, @Body() updateGroceryDto: UpdateGroceryDto) {
    const data = await this.groceryService.updateGrocery(id, updateGroceryDto)

    return {
      data,
    }
  }

  @Delete(':id')
  async deleteGrocery(@Param() { id }: GroceryItemIdDto) {
    await this.groceryService.deleteGrocery(id)

    return {
      message: 'Grocery item deleted successfully',
    }
  }
  @Get(':id')
  async getGroceryItem(@Param() { id }: GroceryItemIdDto) {
    const data = await this.groceryService.getGroceryItemById(id)

    return {
      data,
    }
  }

}
