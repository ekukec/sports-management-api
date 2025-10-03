import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ClassResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    sportId: string;

    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    description?: string;

    @ApiProperty()
    durationMinutes: number;

    @ApiPropertyOptional()
    instructorName?: string;

    @ApiPropertyOptional()
    location?: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiPropertyOptional()
    sport?: any;

    @ApiPropertyOptional()
    classSchedules?: any[];
}