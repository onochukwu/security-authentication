import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CodeType = 'user' | 'user_guest';

@Schema({ timestamps: true })
export class Code extends Document {
  declare _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  code: string;

  @Prop({ default: 'user', enum: ['user', 'user_guest'] })
  type: CodeType;

  @Prop()
  guestName: string;

  @Prop()
  guestPurpose: string;

  @Prop({ default: false })
  used: boolean;

  @Prop()
  expiresAt: Date;
}

export const CodeSchema = SchemaFactory.createForClass(Code);
