import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ReflectionService } from './reflections.service';
import { Reflection } from './entities/reflection.entity';
import { CreateReflectionDto, UpdateReflectionDto } from './dto';

@Controller('reflections')
export class ReflectionController {
  constructor(private readonly reflectionService: ReflectionService) {}

  @Get()
  async findAll(): Promise<Reflection[]> {
    return this.reflectionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Reflection | null> {
    return this.reflectionService.findOne(id);
  }

  @Post()
  async create(
    @Body() createReflectionDto: CreateReflectionDto,
  ): Promise<Reflection> {
    return this.reflectionService.create(createReflectionDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReflectionDto: UpdateReflectionDto,
  ): Promise<Reflection | null> {
    return this.reflectionService.update(id, updateReflectionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.reflectionService.remove(id);
  }
}
