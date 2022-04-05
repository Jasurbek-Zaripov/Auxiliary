import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type PersonDocument = Person & Document;

@Schema()
export class Person {
    @Prop({ minlength: [2, 'The name is too short'], maxlength: [30, 'The name is too long'] })
    name: string;

    @Prop({ minlength: [4, 'The login is too short'], maxlength: [25, 'The login is too long'] })
    login: string;

    @Prop({ minlength: [4, 'The password is too short'], maxlength: [12, 'The password is too long'] })
    password: string;

    @Prop({
        enum: { values: ['admin', 'teacher', 'assistent', 'student'], message: 'Invalid role' },
        default: 'student'
    })
    role: string;

    @Prop({ default: new Date() })
    created_at: string;
}
export const PersonSchema = SchemaFactory.createForClass(Person);