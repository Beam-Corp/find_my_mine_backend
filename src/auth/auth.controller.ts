import { Body, Controller, Get, Post, Query, Res, UseGuards, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt.guards';
import { Cookies } from 'utils/decorators';
import { validationPipe } from 'utils/validation';
import { LoginDTO, PlayerDTO } from '../player/dto/player.dto';
import { PlayerService } from '../player/player.service';
import { JwtPayload } from './jwt.constant';

@Controller('auth')
export class AuthController {
    constructor(private readonly playerService: PlayerService, private readonly authService: AuthService){}
    @UsePipes(validationPipe)
    @Post("login")
    async login(@Body('payload') {userId,password}: LoginDTO, @Res({passthrough: true}) res:Response)  {
        const player = await this.playerService.login(userId,password);
        const token = this.authService.getJwt(player.userId,player.role);
        res.cookie('jwt', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
          secure: true,
          sameSite: "none"
        })
        return {userId: player.userId,role: player.role, customization: player.customization}
    }
    @UsePipes(validationPipe)
    @Post("register")
    async register(@Body('payload') payload: PlayerDTO): Promise<boolean> {
        const player = await this.playerService.register(payload);
        return !!player;
    }
    @UseGuards(JwtAuthGuard)
    @UsePipes(validationPipe)
    @Post('logout')
    async logout(@Res({passthrough: true}) res:Response) {
        res.clearCookie('jwt')
        return {success: true}
    }
    @UseGuards(JwtAuthGuard)
    @UsePipes(validationPipe)
    @Get("verify")
    async verify(@Cookies('jwt') token: string ){
        const payload = this.authService.decodeJwt<JwtPayload>(token);
        const player = await this.playerService.findByPlayerId(payload.userId);
        return {userId: player.userId,role: player.role, customization: player.customization};
    }


}
