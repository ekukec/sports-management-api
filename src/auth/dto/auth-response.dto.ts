import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class AuthUserDto {
    @ApiProperty({
        description: 'Unique identifier for the user (UUID)', 
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    id: string;

    @ApiProperty({
        description: 'User email address',
        example: 'john.doe@example.com'
    })
    email: string;

    @ApiProperty({
        description: 'User first name',
        example: 'John'
    })
    firstName: string | null;

    @ApiProperty({
        description: 'User last name',
        example: 'Doe'
    })
    lastName: string | null;

    @ApiProperty({
        description: 'User role',
        enum: UserRole, 
        example: UserRole.USER
    })
    role: UserRole;

    @ApiProperty({
        description: 'Is the current user an active user',
        example: true
    })
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}