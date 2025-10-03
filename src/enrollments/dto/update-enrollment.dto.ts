import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateEnrollmentDto } from "./create-enrollment.dto";
import { EnrollmentStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateEnrollmentDto extends PartialType(CreateEnrollmentDto) {
    @ApiPropertyOptional({
        enum: EnrollmentStatus,
        example: 'APPROVED',
        description: 'Enrollment status'
    })
    @IsOptional()
    @IsEnum(EnrollmentStatus)
    status?: EnrollmentStatus;
}