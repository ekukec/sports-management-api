import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { SportsService } from './sports.service';
import { Roles } from 'src/auth/decorators';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSportDto, SportResponseDto, UpdateSportDto } from './dto';

@ApiTags('Sports')
@ApiBearerAuth('access-token')
@Controller('sports')
export class SportsController {
    constructor(private sportsService: SportsService){}

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new sport (Admin only)' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Sport successfully created',
        type: SportResponseDto
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Sport with this name already exists'
    })
    create(@Body() createSportDto: CreateSportDto) {
        return this.sportsService.create(createSportDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all sports' })
    @ApiQuery({
        name: 'isActive',
        required: false,
        type: Boolean,
        description: 'Filter by active status'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of sports',
        type: [SportResponseDto]
    })
    findAll(@Query('isActive') isActive?: string) {
        const activeFilter = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
        return this.sportsService.findAll(activeFilter);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get sport by ID' })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Sport UUID'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Sport details',
        type: SportResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Sport not found'
    })
    findOne(@Param('id') id: string) {
        return this.sportsService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update sport (Admin only)' })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Sport UUID'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Sport successfully updated',
        type: SportResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Sport not found'
    })
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateSportDto: UpdateSportDto) {
        return this.sportsService.update(id, updateSportDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete sport (Admin only)' })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Sport UUID'
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Sport successfully deleted'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Sport not found'
    })
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.sportsService.remove(id);
    }

    @Patch(':id/toggle-active')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Toggle sport active status (Admin only)' })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Sport UUID'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Sport status toggled',
        type: SportResponseDto
    })
    toggleActive(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.sportsService.toggleActive(id);
    }
}
