import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Code extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  code: string; // store plain for this starter; consider hashing in production

  @Prop({ default: false })
  used: boolean;

  @Prop()
  expiresAt: Date;
}

export const CodeSchema = SchemaFactory.createForClass(Code);