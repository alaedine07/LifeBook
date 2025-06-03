import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DayEntryService } from './day-entry.service';

@Controller('day-entries')
export class DayEntryController {
  constructor(private readonly dayEntryService: DayEntryService) {}

  @Post()
  async createEntry(@Body() { date }: { date: string }) {
    try {
      return await this.dayEntryService.createEntry(new Date(date));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':id/answers')
  async addAnswer(
    @Param('id') entryId: string,
    @Body() body: { reflectionIdentifier: string; answer: string },
  ) {
    try {
      return await this.dayEntryService.addAnswer(
        entryId,
        body.reflectionIdentifier,
        body.answer,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getEntry(@Param('id') entryId: string) {
    try {
      const entry = await this.dayEntryService.getEntry(entryId);
      if (!entry) {
        throw new HttpException('Entry not found', HttpStatus.NOT_FOUND);
      }
      return entry;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getEntriesByDate(@Query('date') dateString: string) {
    try {
      if (!dateString) {
        throw new HttpException(
          'Date parameter is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.dayEntryService.getEntriesByDate(new Date(dateString));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async updateEntry(
    @Param('id') entryId: string,
    @Body()
    body: { responses: { reflection_text: string; answers: string[] }[] },
  ) {
    try {
      return await this.dayEntryService.updateEntry(entryId, body.responses);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteEntry(@Param('id') entryId: string) {
    try {
      await this.dayEntryService.deleteEntry(entryId);
      return { message: 'Entry deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
