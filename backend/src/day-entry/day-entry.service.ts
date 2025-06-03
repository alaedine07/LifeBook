import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DayEntry } from './entities/day-entry.entity';
import { ReflectionService } from '../reflections/reflections.service';

@Injectable()
export class DayEntryService {
  constructor(
    @InjectRepository(DayEntry)
    private dayEntryRepository: Repository<DayEntry>,
    private reflectionService: ReflectionService,
  ) {}

  async createEntry(date: Date): Promise<DayEntry> {
    const currentReflections = await this.reflectionService.findAll();

    const entry = this.dayEntryRepository.create({
      entryDate: date,
      responses: currentReflections.map((reflection) => ({
        reflection_text: reflection.content,
        answers: [],
      })),
      createdAt: new Date(),
    });

    return this.dayEntryRepository.save(entry);
  }

  async addAnswer(
    entryId: string,
    reflectionIdentifier: string,
    answer: string,
  ): Promise<DayEntry> {
    const entry = await this.dayEntryRepository.findOneBy({ id: entryId });

    if (!entry) {
      throw new Error('Day entry not found');
    }

    const response = entry.responses.find((r) =>
      r.reflection_text.includes(reflectionIdentifier),
    );

    if (!response) {
      throw new Error('Reflection not found in this entry');
    }

    response.answers.push(answer);
    return this.dayEntryRepository.save(entry);
  }

  async getEntry(entryId: string): Promise<DayEntry> {
    const entry = await this.dayEntryRepository.findOneBy({ id: entryId });
    if (!entry) {
      throw new Error('Day entry not found');
    }
    return entry;
  }

  async getEntriesByDate(date: Date): Promise<DayEntry[]> {
    const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    return this.dayEntryRepository
      .createQueryBuilder('entry')
      .where('DATE(entry.entryDate) = :date', { date: formattedDate })
      .orderBy('entry.createdAt', 'DESC')
      .getMany();
  }

  async updateEntry(
    entryId: string,
    updatedResponses: { reflection_text: string; answers: string[] }[],
  ): Promise<DayEntry> {
    const entry = await this.dayEntryRepository.findOneBy({ id: entryId });
    if (!entry) {
      throw new Error('Day entry not found');
    }
    entry.responses = updatedResponses;
    return this.dayEntryRepository.save(entry);
  }

  async deleteEntry(entryId: string): Promise<void> {
    await this.dayEntryRepository.delete(entryId);
  }
}
