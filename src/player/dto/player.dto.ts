import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class Customization {
  @IsString()
  color: string
  @IsString()
  avatar: string
}
export class PlayerDTO {
  @IsString()
  @MaxLength(12)
  @MinLength(6)
  userId: string
  @IsString()
  @MaxLength(12)
  @MinLength(6)
  password: string
  @Type(() => Customization)
  @IsOptional()
  customization?: Customization
}

export class LoginDTO {
  @IsString()
  @MaxLength(12)
  @MinLength(6)
  userId: string
  @IsString()
  @MaxLength(12)
  @MinLength(6)
  password: string
}

export class GameplayStatistics {
  @IsNumber()
  winCount: number

  @IsNumber()
  drawCount: number

  @IsNumber()
  loseCount: number
}
