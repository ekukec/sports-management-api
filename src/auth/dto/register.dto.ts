import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger'
import {IsEmail, IsString, Matches, MaxLength, MinLength} from 'class-validator'

export class RegisterDto {
    @ApiProperty({
        description: 'User email address',
        example: 'john.doe@example.com'
    })
    @IsEmail({}, {message: 'Please provide a valid email address'})
    email: string;

    @ApiProperty({
        description: 'User password (min 8 characters, must contain uppercase, lowercase, number)',
        example: 'Password123'
    })
    @IsString()
    @MinLength(8, {message: 'Password must be at least 8 characters long'})
    @MaxLength(32, {message: 'Password must not exceed 32 characters'})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
        {
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        }
    )
    password: string;

    @ApiPropertyOptional({
        description: 'User first name',
        example: 'John'
    })
    @IsString()
    @MaxLength(100)
    firstName?: string;

    @ApiPropertyOptional({
        description: 'User last name',
        example: 'Doe'
    })
    @IsString()
    @MaxLength(100)
    lastName?: string;
}