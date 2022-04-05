import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionDocument } from 'src/schema/Question.schema';
import { Model } from 'mongoose';

type QuestionModel = Model<QuestionDocument>;
@Controller('question')
export class QuestionController {
    constructor(@InjectModel(Question.name) private questionModel: QuestionModel) { }

    @Get()
    async getQuestion() {
        try {
            return await this.questionModel.find();
        } catch (error) {
            console.log(error);
            return { statusCode: null, error };
        }
    }
}
