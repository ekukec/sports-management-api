import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto, EnrollmentResponseDto, FilterEnrollmentsDto, UpdateEnrollmentDto, UpdateEnrollmentStatusDto } from './dto';
import { CurrentUser, Roles } from 'src/auth/decorators';
import type { CurrentUserType } from 'src/auth/decorators';
import { EnrollmentStatus, UserRole } from '@prisma/client';

@ApiTags('Enrollments')
@ApiBearerAuth('access-token')
@Controller('enrollments')
export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) {}

    @Post('apply')
    @ApiOperation({ 
        summary: 'Apply for a sport class',
        description: 'User can apply for a sport class. The enrollment will be in PENDING status'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Successfully applied for the class',
        type: EnrollmentResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Class not found'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Already enrolled in this class'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Cannot enroll in inactive class'
    })
    apply(@CurrentUser() user: CurrentUserType, @Body() createEnrollmentDto: CreateEnrollmentDto) {
        return this.enrollmentsService.apply(user.id, createEnrollmentDto);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ 
        summary: 'Get all enrollments with filters (Admin only)',
        description: 'Admin can view all enrollments with various filters'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of filtered enrollments',
        type: [EnrollmentResponseDto]
    })
    findAll(@Query() filterDto: FilterEnrollmentsDto) {
        return this.enrollmentsService.findAll(filterDto);
    }

    @Get('my-enrollments')
    @ApiOperation({ 
        summary: 'Get current user enrollments',
        description: 'Get all enrollments for the authenticated user'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of user enrollments',
        type: [EnrollmentResponseDto]
    })
    getMyEnrollments(@CurrentUser() user: CurrentUserType) {
        return this.enrollmentsService.findUserEnrollments(user.id);
    }

    @Get('class/:classId')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ 
        summary: 'Get enrollments for a specific class (Admin only)',
        description: 'View all users who applied for a specific class with optional date range'
    })
    @ApiParam({
        name: 'classId',
        type: String,
        description: 'Class UUID'
    })
    @ApiQuery({
        name: 'fromDate',
        required: false,
        type: String,
        description: 'Filter from date (YYYY-MM-DD)'
    })
    @ApiQuery({
        name: 'toDate',
        required: false,
        type: String,
        description: 'Filter to date (YYYY-MM-DD)'
    })
    @ApiQuery({
        name: 'status',
        required: false,
        enum: EnrollmentStatus,
        description: 'Filter by enrollment status'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of class enrollments',
        type: [EnrollmentResponseDto]
    })
    getClassEnrollments(
        @Param('classId', ParseUUIDPipe) classId: string,
        @Query('fromDate') fromDate?: string,
        @Query('toDate') toDate?: string,
        @Query('status') status?: EnrollmentStatus
    ) {
        return this.enrollmentsService.getClassEnrollments(classId, fromDate, toDate, status);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get enrollment by ID' })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Enrollment UUID'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Enrollment details',
        type: EnrollmentResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Enrollment not found'
    })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.enrollmentsService.findOne(id);
    }

    @Patch(':id/status')
    @ApiOperation({ 
        summary: 'Update enrollment status',
        description: 'Admin can update any status, users can only cancel their own enrollments'
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Enrollment UUID'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Enrollment status updated',
        type: EnrollmentResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Enrollment not found'
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Insufficient permissions'
    })
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateStatusDto: UpdateEnrollmentStatusDto,
        @CurrentUser() user: CurrentUserType
    ) {
        return this.enrollmentsService.updateStatus(
            id, 
            updateStatusDto.status,
            user.id,
            user.role as UserRole
        );
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ 
        summary: 'Update enrollment details (Admin only)',
        description: 'Admin can update enrollment dates and notes'
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Enrollment UUID'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Enrollment updated',
        type: EnrollmentResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Enrollment not found'
    })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateEnrollmentDto: UpdateEnrollmentDto
    ) {
        return this.enrollmentsService.update(id, updateEnrollmentDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ 
        summary: 'Delete enrollment (Admin only)',
        description: 'Permanently delete an enrollment record'
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Enrollment UUID'
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Enrollment deleted'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Enrollment not found'
    })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.enrollmentsService.remove(id);
    }

    @Post(':id/cancel')
    @ApiOperation({ 
        summary: 'Cancel own enrollment',
        description: 'User can cancel their own enrollment'
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'Enrollment UUID'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Enrollment cancelled',
        type: EnrollmentResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Enrollment not found'
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Can only cancel own enrollments'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Enrollment already cancelled'
    })
    cancelEnrollment(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: CurrentUserType
    ) {
        return this.enrollmentsService.updateStatus(
            id, 
            EnrollmentStatus.CANCELLED,
            user.id,
            user.role as UserRole
        );
    }
}
