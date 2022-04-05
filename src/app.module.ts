import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompilerModule } from './compiler/compiler.module';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [CompilerModule, ConfigModule.forRoot(), QuestionModule, MongooseModule.forRoot(process.env.mongoURL)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
