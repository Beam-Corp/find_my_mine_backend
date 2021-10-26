import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema } from './player.schema';
import { PlayerService } from './player.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    providers: [PlayerService],
    imports: [MongooseModule.forFeature([{name: "Player", schema: PlayerSchema}])],
    exports: [PlayerService],
})
export class PlayerModule {}
