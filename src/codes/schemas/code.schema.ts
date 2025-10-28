import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Code 
{  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  code: string;

  @Prop({ default: false })
  used: boolean;

  @Prop()
  expiresAt: Date;
}

export const CodeSchema = SchemaFactory.createForClass(Code);