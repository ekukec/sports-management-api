import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, Min, ValidateNested } from "class-validator";
import { CreateScheduleDto } from "./create-schedule.dto";
import { Type } from "class-transformer";

export class CreateClassDto {
    @ApiProperty({
        example: 'c1234567-89ab-cdef-0123-456789abcdef',
        description: 'Sport UUID'
    })
    @IsNotEmpty()
    @IsUUID()
    sportId: string;

    @ApiProperty({
        example: 'Beginners Basketball',
        description: 'Name of the class'
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiPropertyOptional({
        example: 'Basic basketball skills for beginners',
        description: 'Description of the class'
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: 60,
        description: 'Duration of the class in minutes',
        minimum: 15
    })
    @IsNotEmpty()
    @IsInt()
    @Min(15)
    durationMinutes: number;

    @ApiPropertyOptional({
        example: 'John Doe',
        description: 'Name of the instructor'
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    instructorName?: string;

    @ApiPropertyOptional({
        example: 'Gym A, Building 1',
        description: 'Location of the class'
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    location?: string;

    @ApiPropertyOptional({
        default: true
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({
        type: [CreateScheduleDto],
        description: 'Weekly schedules for the class'
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateScheduleDto)
    schedules?: CreateScheduleDto[];
}