import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from '@nestjs/config'

export interface  JwtPayload {
    sub: string,
    email: string,
    role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private configService: ConfigService, private prisma: PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET')!
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
                isActive: true
            }
        });

        if(!user){
            throw new UnauthorizedException('User not found or inactive!')
        }

        const {password, ...result} = user;
        return result;
    }
}
