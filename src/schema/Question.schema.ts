import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

//for type
export class ForTest {
    function_name: string[];
    input: string[];
    output: string[];
}
export class Script {
    type: string;
    file_buffer: Buffer;
}

@Schema()
export class Question {
    @Prop({ minlength: [2, 'The name is too short'], maxlength: [30, 'The name is too long'] })
    name: string;

    @Prop()
    person_id: string;

    @Prop({ type: Script })
    script: Script;

    @Prop({ type: ForTest })
    _4test: ForTest;

    @Prop({ default: 0 })
    download_count: number;

    @Prop({ default: null })
    changed_at: Date;

    @Prop({ default: new Date() })
    created_at: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

