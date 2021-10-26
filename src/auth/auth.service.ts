import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {
    }
getJwt(userId:string,role: string) {
        return this.jwtService.sign({userId,role});
}
decodeJwt<T>(jwt: string): T {
    const message = this.jwtService.decode(jwt) as T;
    return message;
}
}
