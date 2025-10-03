import { ApiPropertyOptional } from "@nestjs/swagger";
import { DayOfWeek } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

/**
 * DTO for filtering sports classes
 */
export class FilterClassesDto {
    @ApiPropertyOptional({
        type: [String],
        example: ['Basketball', 'Football'],
        description: 'Filter by sport names (comma-separated in query)'
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.split(',').map(s => s.trim());
        }
        return value;
    })
    @IsArray()
    @IsString({ each: true })
    sports?: string[];

    @ApiPropertyOptional({
        example: 'John',
        description: 'Filter by instructor name (partial match)'
    })
    @IsOptional()
    @IsString()
    instructorName?: string;

    @ApiPropertyOptional({
        example: 'Gym A',
        description: 'Filter by location (partial match)'
    })
    @IsOptional()
    @IsString()
    location?: string;

    //TODO: Get this to work out of the box
    // @ApiPropertyOptional({
    //     example: true,
    //     description: 'Filter by active status'
    // })
    // @IsOptional()
    // @Transform(({ value }) => {
    //     if (typeof value === 'string') {
    //         const val = value.trim().toLowerCase();
    //         if (val === 'true') return true;
    //         if (val === 'false') return false;
    //     }
    //     return value;
    // })
    // @IsBoolean()
    // isActive?: boolean;

    @ApiPropertyOptional({
        enum: DayOfWeek,
        example: 'MONDAY',
        description: 'Filter by day of week'
    })
    @IsOptional()
    @IsEnum(DayOfWeek)
    dayOfWeek?: DayOfWeek;
}