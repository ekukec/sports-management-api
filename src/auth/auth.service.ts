import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto, LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client'
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const { email, password, firstName, lastName } = registerDto;

        const existingUser = await this.prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName
            }
        });

        return await this.createAuthResponse(user);
    }

    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials!');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Account is deactivated!');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.createAuthResponse(user);
    }

    async getProfile(userId: string): Promise<Omit<User, 'password'>>{
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user){
            throw new UnauthorizedException('User not found'); 
        }

        const {password, ...userWithoutPassword} = user;

        return userWithoutPassword;
    }

    private async createAuthResponse(user: User): Promise<AuthResponseDto> {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role
        }

        const accessToken = this.jwtService.sign(payload);

        const { password, ...userWithoutPassword } = user;

        return {
            accessToken,
            user: userWithoutPassword
        }
    }
}
