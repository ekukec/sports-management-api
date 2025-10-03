import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { ClassResponseDto, CreateClassDto, CreateScheduleDto, FilterClassesDto, UpdateClassDto, UpdateScheduleDto } from './dto';
import { Roles } from 'src/auth/decorators';
import { UserRole } from '@prisma/client';

@ApiTags('Classes')
@ApiBearerAuth('access-token')
@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) {}

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new sport class (Admin only)' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Class successfully created',
        type: ClassResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Sport not found'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Class with this name already exists'
    })
    create(@Body() createClassDto: CreateClassDto) {
        return this.classesService.create(createClassDto);
    }

    @Get()
    @ApiOperation({ 
        summary: 'Get all sport classes with filters',
        description: 'Filter classes by sports, instructor, location, active status, or day of week. Example: /api/classes?sports=Basketball,Football'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of filtered classes',
        type: [ClassResponseDto]
    })
    findAll(@Query() filterDto: FilterClassesDto) {
        return this.classesService.findAll(filterDto);
    }

    @Get(':id')
    @ApiOperation({ 
        summary: 'Get class details by ID',
        description: 'Retrieve full details including week schedule'
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Class UUID'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Class details with schedules and enrollments',
        type: ClassResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Class not found'
    })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.classesService.findOne(id, {includeRelations: true});
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update sport class (Admin only)' })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Class UUID'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Class successfully updated',
        type: ClassResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Class not found'
    })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateClassDto: UpdateClassDto
    ) {
        return this.classesService.update(id, updateClassDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete sport class (Admin only)' })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Class UUID'
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Class successfully deleted'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Class not found'
    })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.classesService.remove(id);
    }

    @Get(':id/schedules')
    @ApiOperation({ summary: 'Get all schedules for a class' })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Class UUID'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of class schedules'
    })
    getSchedules(@Param('id', ParseUUIDPipe) id: string) {
        return this.classesService.getClassSchedules(id);
    }

    @Post(':id/schedules')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Add a schedule to a class (Admin only)' })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Class UUID'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Schedule successfully added'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Class not found'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Schedule already exists for this time'
    })
    addSchedule(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() createScheduleDto: CreateScheduleDto
    ) {
        return this.classesService.addSchedule(id, createScheduleDto);
    }

    @Patch('schedules/:scheduleId')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update a class schedule (Admin only)' })
    @ApiParam({
        name: 'scheduleId',
        type: String,
        description: 'Schedule UUID'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Schedule successfully updated'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Schedule not found'
    })
    updateSchedule(
        @Param('scheduleId', ParseUUIDPipe) scheduleId: string,
        @Body() updateScheduleDto: UpdateScheduleDto
    ) {
        return this.classesService.updateSchedule(scheduleId, updateScheduleDto);
    }

    @Delete('schedules/:scheduleId')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a class schedule (Admin only)' })
    @ApiParam({
        name: 'scheduleId',
        type: String,
        description: 'Schedule UUID'
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Schedule successfully deleted'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Schedule not found'
    })
    removeSchedule(@Param('scheduleId', ParseUUIDPipe) scheduleId: string) {
        return this.classesService.removeSchedule(scheduleId);
    }
}
