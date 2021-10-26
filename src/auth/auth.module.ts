import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PlayerModule } from 'src/player/player.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './jwt.constant';
import { AdminGuard, JwtAuthGuard } from './jwt.guards';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
      PlayerModule,
      PassportModule,
      JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '24h' },
      }),
    ],
    providers: [AuthService,JwtStrategy,AdminGuard,JwtAuthGuard],
    exports: [AuthService,AdminGuard,JwtAuthGuard],
    controllers:[AuthController]
  })
  export class AuthModule {}
