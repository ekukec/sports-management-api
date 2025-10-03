import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
    @ApiPropertyOptional({
        example: 'john.doe@example.com'
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({
        description: 'User password (min 8 characters, must contain uppercase, lowercase, number)',
        example: 'Password123'
    })
    @IsOptional()
    @IsString()
    @MinLength(8, {message: 'Password must be at least 8 characters long'})
    @MaxLength(32, {message: 'Password must not exceed 32 characters'})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
        {
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        }
    )
    password?: string;

    @ApiPropertyOptional({
        example: 'John'
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    firstName?: string;

    @ApiPropertyOptional({
        example: 'Doe'
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    lastName?: string;

    @ApiPropertyOptional({
        enum: UserRole,
        example: UserRole.USER
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiPropertyOptional({
        example: true
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}