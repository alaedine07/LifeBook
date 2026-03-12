// web/src/therapists/reflection-comments.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import type { User } from '@prisma/client';
import { TherapistsService } from './therapists.service';
import { AddReflectionCommentDto } from './dto/add-reflection-comment.dto';
import { UpdateReflectionCommentDto } from './dto/update-reflection-comment.dto';

@Controller('therapists/reflection-comments')
@UseGuards(AuthGuard('jwt'))
export class ReflectionCommentsController {
  constructor(private therapistsService: TherapistsService) {}

  // POST a new comment on a reflection
  @Post(':answerId')
  addComment(
    @Param('answerId') answerId: string,
    @Body() dto: AddReflectionCommentDto,
    @GetUser() user: User
  ) {
    return this.therapistsService.addReflectionComment(user.id, parseInt(answerId), dto.comment);
  }

  @Get(':answerId')
  getComments(
    @Param('answerId') answerId: string,
    @GetUser() user: User
  ) {
    return this.therapistsService.getReflectionComments(
      user.id,
      parseInt(answerId),
    );
  }

  @Put(':commentId')
  updateComment(
    @Param('commentId') commentId: string,
    @Body() dto: UpdateReflectionCommentDto,
    @GetUser() user: User
  ) {
    return this.therapistsService.updateReflectionComment(user.id, parseInt(commentId), dto.comment);
  }

  @Delete(':commentId')
  deleteComment(
    @Param('commentId') commentId: string,
    @GetUser() user: User
  ) {
    return this.therapistsService.deleteReflectionComment(user.id, parseInt(commentId));
  }
}
