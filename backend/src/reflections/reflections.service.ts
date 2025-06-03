import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reflection } from './entities/reflection.entity';
import { CreateReflectionDto, UpdateReflectionDto } from './dto';

@Injectable()
export class ReflectionService {
  constructor(
    @InjectRepository(Reflection)
    private reflectionRepository: Repository<Reflection>,
  ) {}

  async findAll(): Promise<Reflection[]> {
    return this.reflectionRepository.find();
  }

  async findOne(id: string): Promise<Reflection | null> {
    return this.reflectionRepository.findOne({ where: { id } });
  }

  async create(createReflectionDto: CreateReflectionDto): Promise<Reflection> {
    //
    const reflection = this.reflectionRepository.create(createReflectionDto);
    return this.reflectionRepository.save(reflection);
  }

  async update(
    id: string,
    updateReflectionDto: UpdateReflectionDto,
  ): Promise<Reflection | null> {
    await this.reflectionRepository.update(id, updateReflectionDto);
    return this.reflectionRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.reflectionRepository.delete(id);
  }
}
