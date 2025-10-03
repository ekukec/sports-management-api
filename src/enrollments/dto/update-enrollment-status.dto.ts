import { ApiProperty } from "@nestjs/swagger";
import { EnrollmentStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UpdateEnrollmentStatusDto {
    @ApiProperty({
        enum: EnrollmentStatus,
        example: 'APPROVED',
        description: 'New enrollment status'
    })
    @IsNotEmpty()
    @IsEnum(EnrollmentStatus)
    status: EnrollmentStatus;
}