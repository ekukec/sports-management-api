import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EnrollmentStatus } from "@prisma/client";

export class EnrollmentResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    classId: string;

    @ApiProperty({
        enum: EnrollmentStatus
    })
    status: EnrollmentStatus;

    @ApiProperty()
    enrollmentDate: Date;

    @ApiPropertyOptional()
    startDate?: Date;

    @ApiPropertyOptional()
    endDate?: Date;

    @ApiPropertyOptional()
    notes?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiPropertyOptional()
    user?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };

    @ApiPropertyOptional()
    sportClass?: any;
}