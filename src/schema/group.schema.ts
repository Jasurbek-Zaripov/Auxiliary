import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
    @Prop({ minlength: [2, 'The name is too short'], maxlength: [30, 'The name is too long'] })
    name: string;

    @Prop()
    teacher_id: string;

    @Prop()
    assistent_id: string[];

    @Prop()
    student_id: string[];

    @Prop({ default: new Date() })
    created_at: string;
}
export const GroupSchema = SchemaFactory.createForClass(Group);