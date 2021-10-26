import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/jwt.constant';
import { JwtAuthGuard } from 'src/auth/jwt.guards';
import { LoginDTO, RegisterDTO } from '../player/dto/player.dto';
import { PlayerService } from '../player/player.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly playerService: PlayerService, private readonly authService: AuthService){}
    @Post("login")
    async login(@Body('payload') {userId,password}: LoginDTO, @Res({passthrough: true}) res:Response): Promise<JwtPayload>  {
        const player = await this.playerService.login(userId,password);
        const token = this.authService.getJwt(player.userId,player.role);
        res.cookie('jwt', token, {
          httpOnly: true,
          domain: process.env.ORIGIN || "localhost", 
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        })
        return {userId: player.userId,role: player.role}
    }
    @Post("register")
    async register(@Body('payload') payload: RegisterDTO): Promise<boolean> {
        const player = await this.playerService.register(payload);
        return !!player;
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Res({passthrough: true}) res:Response) {
        res.clearCookie('jwt')
        return {success: true}
    }


}
