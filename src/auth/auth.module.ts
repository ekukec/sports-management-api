import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard, RolesGuard } from './guards';

@Module({
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard
  ],
  controllers: [AuthController],
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION', '7d')
        }
      })
    })
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    RolesGuard
  ]
})
export class AuthModule {}
