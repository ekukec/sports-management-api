import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class FilterUsersDto {
    @ApiPropertyOptional({
        example: 'john',
        description: 'Filter by email (partial match)'
    })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiPropertyOptional({
        example: 'John',
        description: 'Filter by first name (partial match)'
    })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional({
        example: 'Doe',
        description: 'Filter by last name (partial match)'
    })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiPropertyOptional({
        enum: UserRole,
        example: UserRole.USER,
        description: 'Filter by role'
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    //TODO: Fix the isActive filter here aswell
    // @ApiPropertyOptional({
    //     example: true,
    //     description: 'Filter by active status'
    // })
    // @IsOptional()
    // @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    // @IsBoolean()
    // isActive?: boolean;
}