import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEnrollmentDto, FilterEnrollmentsDto, UpdateEnrollmentDto } from './dto';
import { Enrollment, EnrollmentStatus, Prisma, UserRole } from '@prisma/client';

@Injectable()
export class EnrollmentsService {
    constructor(private prisma: PrismaService) {}

    async apply(userId: string, createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
        const { classId, enrollmentDate, startDate, endDate, notes } = createEnrollmentDto;

        // Get sport class and sport
        const sportClass = await this.prisma.sportClass.findUnique({
            where: { id: classId },
            include: {
                sport: true
            }
        });

        // Throw error if sport not found
        if (!sportClass) {
            throw new NotFoundException('Class not found');
        }

        // Throw error if sport or sport class are inactive
        if (!sportClass.isActive || !sportClass.sport.isActive) {
            throw new BadRequestException('Cannot enroll in inactive class or sport');
        }

        // Check for existing enrollment
        const existingEnrollment = await this.prisma.enrollment.findFirst({
            where: {
                userId,
                classId,
                status: {
                    in: ['PENDING', 'APPROVED']
                }
            }
        });

        // Throw error if user already has active enrollment
        if (existingEnrollment) {
            throw new ConflictException('You already have an active enrollment for this class');
        }

        // Create enrollment with PENDING status
        return await this.prisma.enrollment.create({
            data: {
                userId,
                classId,
                enrollmentDate: enrollmentDate || new Date(),
                startDate,
                endDate,
                notes,
                status: 'PENDING'
            },
        });
    }

    async findAll(filterDto: FilterEnrollmentsDto) {
        const { userId, classId, status, sportId, fromDate, toDate } = filterDto;

        const where: Prisma.EnrollmentWhereInput = {};

        if (userId) where.userId = userId;
        if (classId) where.classId = classId;
        if (status) where.status = status;
        
        if (sportId) {
            where.sportClass = {
                sportId
            };
        }

        if (fromDate || toDate) {
            where.enrollmentDate = {};
            if (fromDate) where.enrollmentDate.gte = new Date(fromDate);
            if (toDate) where.enrollmentDate.lte = new Date(toDate);
        }

        return await this.prisma.enrollment.findMany({
            where,
            include: {
                sportClass: {
                    include: {
                        sport: true,
                        classSchedules: {
                            where: {
                                isActive: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findOne(id: string): Promise<Enrollment> {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { id },
            include: {
                sportClass: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true
                    }
                }
            }
        });

        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }

        return enrollment;
    }

    async findUserEnrollments(userId: string) {
        return await this.prisma.enrollment.findMany({
            where: { userId },
            include: {
                sportClass: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async updateStatus(
        id: string, 
        status: EnrollmentStatus, 
        userId?: string,
        userRole?: UserRole
    ): Promise<Enrollment> {
        const enrollment = await this.findOne(id);

        // Users can only cancel their own enrollments
        if (userRole === UserRole.USER) {
            // Throw error if user tries to cancel someone else's enrollment
            if (enrollment.userId !== userId) {
                throw new ForbiddenException('You can only cancel your own enrollments');
            }
            // Throw error if user tries to change status to any other status other than CANCELLED
            if (status !== EnrollmentStatus.CANCELLED) {
                throw new ForbiddenException('You can only cancel your enrollments');
            }
            // Throw error if enrollment is already in status CANCELLED
            if (enrollment.status === EnrollmentStatus.CANCELLED) {
                throw new BadRequestException('Enrollment is already cancelled');
            }
        }

        return await this.prisma.enrollment.update({
            where: { id },
            data: { status },
            include: {
                sportClass: {
                    include: {
                        sport: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
    }

    async update(id: string, updateEnrollmentDto: UpdateEnrollmentDto): Promise<Enrollment> {
        await this.findOne(id);

        return await this.prisma.enrollment.update({
            where: { id },
            data: updateEnrollmentDto,
            include: {
                sportClass: {
                    include: {
                        sport: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
    }

    async remove(id: string): Promise<Enrollment> {
        await this.findOne(id);

        return await this.prisma.enrollment.delete({
            where: { id }
        });
    }

    async getClassEnrollments(
        classId: string,
        fromDate?: string,
        toDate?: string,
        status?: EnrollmentStatus
    ) {
        const where: Prisma.EnrollmentWhereInput = {
            classId
        };

        if (status) where.status = status;

        if (fromDate || toDate) {
            where.enrollmentDate = {};
            if (fromDate) where.enrollmentDate.gte = new Date(fromDate);
            if (toDate) where.enrollmentDate.lte = new Date(toDate);
        }

        return await this.prisma.enrollment.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: [
                { status: 'asc' },
                { enrollmentDate: 'desc' }
            ]
        });
    }
}
