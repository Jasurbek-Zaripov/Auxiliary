import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Question, QuestionDocument } from 'src/schema/Question.schema';
import { CompilerService } from './compiler.service';
import { ALL_LANGUAGES } from './lang-info';
import { Model } from 'mongoose';
@Controller('compiler')
export class CompilerController {
    constructor(private readonly compilerService: CompilerService,
        @InjectModel(Question.name) private questionModel: Model<QuestionDocument>) { }
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async getResult(@UploadedFile() file: Express.Multer.File, @Body() body: BodyResult) {
        try {
            const { buffer, mimetype } = file;
            if (!body.lang || !buffer || !body.inp || !body.name || !body.out) return { success: false, message: ['ERROR_BAD_REQUEST'] };
            let jsons = this.compilerService.parseJsons(body.name, body.inp, body.out);
            let [name, inp, out] = this.compilerService.convertToArrays(...jsons);
            //save new question
            const question = new this.questionModel();
            question.name = 'Birinchi';
            question.person_id = '1';
            question.script = { type: mimetype, file_buffer: buffer };
            question._4test = { function_name: name, input: inp, output: out };
            await question.validate();
            await question.save();
            //end
            let script = this.compilerService.callFuntion(buffer + '', name, inp); //add console.log(funcName(inpt))
            let result = await this.compilerService.getResult(script.text, ALL_LANGUAGES[body.lang].query, ALL_LANGUAGES[body.lang].max_v); //run and get result
            this.compilerService.preparationResult(result, script.func, out);
            return result;
        } catch (e) {
            console.log('myErro: ', e);
            return { statusCode: 400, error: e };
        }
    }

    @Get('get-languages-info')
    getLangInfo() {
        return ALL_LANGUAGES;
    }
}

interface BodyResult {
    lang: string;
    name: string;
    inp: string;
    out: string;


}