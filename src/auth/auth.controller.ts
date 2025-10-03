import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiOperation, ApiTags, ApiResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from './decorators';
import { AuthResponseDto, AuthUserDto, LoginDto, RegisterDto } from './dto';
import type { CurrentUserType } from './decorators'; 

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User successfully registered',
        type: AuthResponseDto
    })
    @ApiConflictResponse({
        description: 'User with this email already exists'
    })
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(registerDto);
    }

    @Public()
    @Post('login')
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User successfully logged in',
        type: AuthResponseDto
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid credentials'
    })
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
        return this.authService.login(loginDto);
    }

    @Get('profile')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
        status: HttpStatus.OK, 
        description: 'User profile retrieved successfully',
        type: AuthUserDto
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async getProfile(@CurrentUser() user: CurrentUserType): Promise<CurrentUserType> {
        return this.authService.getProfile(user.id);
    }

    @Get('me')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get current user info from token' })
    @ApiResponse({
        status: HttpStatus.OK, 
        description: 'Current user info',
        type: AuthUserDto
    })
    async getCurrentUser(@CurrentUser() user: CurrentUserType): Promise<CurrentUserType>{
        return user;
    }

}
