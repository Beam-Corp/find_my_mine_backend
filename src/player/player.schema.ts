import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Document } from 'mongoose'

import { Customization, GameplayStatistics } from './dto/player.dto'

@Schema()
export class Player {
  @Prop()
  userId: string
  @Prop()
  password: string
  @Prop()
  color: string
  @Prop()
  customization: Customization
  @Prop()
  role: string
  @Prop()
  statistics: GameplayStatistics
}

export const PlayerSchema = SchemaFactory.createForClass(Player)
export type PlayerDoucument = Player & Document
