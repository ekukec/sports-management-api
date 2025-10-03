import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateSportDto {
    @ApiProperty({
        example: 'Basketball',
        description: 'Name of the sport'
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiPropertyOptional({
        example: 'A team sport played on a court',
        description: 'Description of the sport'
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Whether the sport is active',
        default: true
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}