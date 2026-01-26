import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';
import { TherapistsService } from './therapists.service';
import { AddTherapistDto } from './dto/add-therapist.dto';

@Controller('therapists')
@UseGuards(AuthGuard('jwt'))
export class TherapistsController {
  constructor(private therapistsService: TherapistsService) {}

  @Post('add')
  addTherapist(@Body() dto: AddTherapistDto, @GetUser() user: User) {
    return this.therapistsService.addTherapist(user.id, dto.email);
  }

  @Get('patients')
  getPatients(@GetUser() user: User) {
    return this.therapistsService.getPatients(user.id);
  }

  @Get('patient/:patientId/data/:date')
  getPatientData(@Param('patientId') patientId: string, @Param('date') date: string, @GetUser() user: User) {
    return this.therapistsService.getPatientData(user.id, parseInt(patientId), new Date(date));
  }
}
