import { Type } from "class-transformer"
import { IsString, MaxLength, MinLength } from "class-validator"


export class CustomizationDTO {
    @IsString()
    color: string
    @IsString()
    avatar: string
}

export class RegisterDTO {
    @IsString()
    @MaxLength(12)
    @MinLength(6)
    userId: string
    @IsString()
    @MaxLength(12)
    @MinLength(6)
    password: string
    @Type(() => CustomizationDTO)
    customization?: CustomizationDTO
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