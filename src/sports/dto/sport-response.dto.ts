import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SportResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    description: string | null;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiPropertyOptional()
    _count?: {
        sportClasses: number;
    };
}