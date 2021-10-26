import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerDoucument } from './player.schema';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './dto/player.dto';
import { Roles } from 'src/auth/jwt.constant';

@Injectable()
export class PlayerService {
    constructor(@InjectModel("Player") private playerModel: Model<PlayerDoucument>) {}
    async findByPlayerId(id: string){
        const player = await this.playerModel.findOne({userId: id}).then()
        return player;
    }
    async login(userId: string, password: string) {
        const player = await this.findByPlayerId(userId);
        if (!player) throw new BadRequestException("UserId does not exist");
        if (!bcrypt.compare(password,player.password)) throw new UnauthorizedException("Wrong password");
        return player;
    }
    async register({userId,password,customization}: RegisterDTO) {
        if (await this.findByPlayerId(userId)) throw new BadRequestException("UserId already exist");
        const hashedPassword = await bcrypt.hash(password,10);
        const player = await this.playerModel.create({userId,password: hashedPassword,customization,role: Roles.Player});
        return await player.save();
    }
}
