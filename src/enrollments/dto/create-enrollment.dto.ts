import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateEnrollmentDto {
    @ApiProperty({
        example: 'c1234567-89ab-cdef-0123-456789abcdef',
        description: 'Class UUID to enroll in'
    })
    @IsNotEmpty()
    @IsUUID()
    classId: string;

    @ApiPropertyOptional({
        example: '2025-01-15',
        description: 'Enrollment date (defaults to today)'
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    enrollmentDate?: Date;

    @ApiPropertyOptional({
        example: '2025-02-01',
        description: 'Start date for the enrollment'
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startDate?: Date;

    @ApiPropertyOptional({
        example: '2025-05-31',
        description: 'End date for the enrollment'
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;

    @ApiPropertyOptional({
        example: 'I would like to join the beginners class',
        description: 'Additional notes or requests'
    })
    @IsOptional()
    @IsString()
    notes?: string;
}