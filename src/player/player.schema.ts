import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Customization } from './dto/player.dto';


@Schema()
export class Player {
  @Prop()
  userId: string;
  @Prop()
  password: string;
  @Prop()
  color: string;
  @Prop()
  customization: Customization;
  @Prop()
  role: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
export type PlayerDoucument = Player & Document;