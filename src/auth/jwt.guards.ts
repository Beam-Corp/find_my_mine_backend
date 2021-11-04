import { Injectable, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { PlayerService } from "src/player/player.service"
import { AuthService } from "./auth.service"
import { JwtPayload, Roles } from "./jwt.constant"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

@Injectable()
export class AdminGuard extends AuthGuard("jwt") {
  constructor(private readonly playerService: PlayerService,private readonly authService: AuthService) {
    super()
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const valid = await super.canActivate(context)
    if (!valid) throw new UnauthorizedException()
    const cookies = context.switchToHttp().getRequest().cookies;
    if (!cookies || !cookies['jwt']) throw new UnauthorizedException()
    const {userId} = this.authService.decodeJwt<JwtPayload>(cookies['jwt'])
    const admin = await this.playerService.findByPlayerId(userId);
    if (admin.role !== Roles.Admin) throw new ForbiddenException()
    return admin.role===Roles.Admin
  }
}
