export const jwtConstants = {
    secret: process.env.JWT_SECRET || "secret"
}

export interface JwtPayload {
    userId: string,
    role: string
}