import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/decorators';
import { FilterUsersDto, UpdateUserDto, UserResponseDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Get()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ 
        summary: 'Get all users (Admin only)',
        description: 'Get all users with optional filters'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of users',
        type: [UserResponseDto]
    })
    findAll(@Query() filterDto: FilterUsersDto) {
        return this.usersService.findAll(filterDto);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ 
        summary: 'Update user (Admin only)',
        description: 'Update user information'
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'User UUID'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User updated',
        type: UserResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User not found'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email already in use'
    })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ 
        summary: 'Delete user (Admin only)',
        description: 'Permanently delete a user account'
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'User UUID'
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'User deleted'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User not found'
    })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.remove(id);
    }
}
