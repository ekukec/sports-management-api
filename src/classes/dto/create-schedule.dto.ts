import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DayOfWeek } from "@prisma/client";
import { IsBoolean, IsDateString, IsEnum, IsOptional, Matches } from "class-validator";

export class CreateScheduleDto {
    @ApiProperty({
        enum: DayOfWeek,
        example: 'MONDAY',
        description: 'Day of the week'
    })
    @IsEnum(DayOfWeek)
    dayOfWeek: DayOfWeek;

    @ApiProperty({
        example: '10:00:00',
        description: 'Start time in HH:MM:SS format'
    })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'startTime must be in HH:mm:ss format',
    })
    startTime: string;

    @ApiProperty({
        example: '11:00:00',
        description: 'End time in HH:MM:SS format'
    })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'startTime must be in HH:mm:ss format',
    })
    endTime: string;

    @ApiPropertyOptional({
        default: true
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}