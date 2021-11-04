export const jwtConstants = {
    secret: process.env.JWT_SECRET || "secret"
}

export interface JwtPayload {
    userId: string,
    role: string
}

export enum Roles {
    Player="player",
    Admin="admin"
}