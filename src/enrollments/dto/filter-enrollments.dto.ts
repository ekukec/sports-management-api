import { ApiPropertyOptional } from "@nestjs/swagger";
import { EnrollmentStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsOptional, IsUUID } from "class-validator";

export class FilterEnrollmentsDto {
    @ApiPropertyOptional({
        example: 'c1234567-89ab-cdef-0123-456789abcdef',
        description: 'Filter by user ID'
    })
    @IsOptional()
    @IsUUID()
    userId?: string;

    @ApiPropertyOptional({
        example: 'c1234567-89ab-cdef-0123-456789abcdef',
        description: 'Filter by class ID'
    })
    @IsOptional()
    @IsUUID()
    classId?: string;

    @ApiPropertyOptional({
        example: 'c1234567-89ab-cdef-0123-456789abcdef',
        description: 'Filter by sport ID'
    })
    @IsOptional()
    @IsUUID()
    sportId?: string;

    @ApiPropertyOptional({
        enum: EnrollmentStatus,
        example: 'APPROVED',
        description: 'Filter by enrollment status'
    })
    @IsOptional()
    @IsEnum(EnrollmentStatus)
    status?: EnrollmentStatus;

    @ApiPropertyOptional({
        example: '2025-01-01',
        description: 'Filter enrollments from this date'
    })
    @IsOptional()
    @IsDateString()
    fromDate?: string;

    @ApiPropertyOptional({
        example: '2025-12-31',
        description: 'Filter enrollments to this date'
    })
    @IsOptional()
    @IsDateString()
    toDate?: string;
}