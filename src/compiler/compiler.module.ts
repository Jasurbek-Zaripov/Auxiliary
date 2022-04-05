import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from 'src/schema/Question.schema';
import { CompilerController } from './compiler.controller';
import { CompilerService } from './compiler.service';

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }])],
  providers: [CompilerService],
  controllers: [CompilerController],
})
export class CompilerModule { }
