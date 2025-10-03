import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassDto, CreateScheduleDto, FilterClassesDto, UpdateClassDto, UpdateScheduleDto } from './dto';
import { ClassSchedule, Prisma, SportClass } from '@prisma/client';

@Injectable()
export class ClassesService {
    constructor(private prisma: PrismaService) {}

    private convertTimeStringToDate(timeString: string){
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, seconds, 0);
        return date;
    }

    async create(createClassDto: CreateClassDto): Promise<SportClass> {
        const { schedules, ...classData } = createClassDto;

        const formattedSchedules = schedules?.map((s) => ({
            ...s,
            startTime: this.convertTimeStringToDate(s.startTime), 
            endTime: this.convertTimeStringToDate(s.endTime)
        }));

        const sport = await this.prisma.sport.findUnique({
            where: { id: classData.sportId }
        });

        if (!sport) {
            throw new NotFoundException('Sport not found');
        }

        try {
            return await this.prisma.sportClass.create({
                data: {
                    ...classData,
                    classSchedules: formattedSchedules ? {
                        create: formattedSchedules
                    } : undefined
                },
                include: {
                    sport: true,
                    classSchedules: true
                }
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Class with this name already exists for this sport');
                }
            }
            throw error;
        }
    }

    async findAll(filterDto: FilterClassesDto) {
        const { sports, instructorName, location, dayOfWeek } = filterDto;
        
        const where: Prisma.SportClassWhereInput = {};
        
        if (sports && sports.length > 0) {
            where.sport = {
                name: {
                    in: sports,
                    mode: 'insensitive'
                }
            };
        }

        if (instructorName) {
            where.instructorName = {
                contains: instructorName,
                mode: 'insensitive'
            };
        }

        if (location) {
            where.location = {
                contains: location,
                mode: 'insensitive'
            };
        }

        // if (isActive !== undefined) {
        //     where.isActive = isActive;
        // }

        if (dayOfWeek) {
            where.classSchedules = {
                some: {
                    dayOfWeek: dayOfWeek,
                    isActive: true
                }
            };
        }

        return await this.prisma.sportClass.findMany({
            where,
            orderBy: [
                { sport: { name: 'asc' } },
                { name: 'asc' }
            ]
        });
    }

    async findOne(id: string, options?: { includeRelations?: boolean }) {
        const sportClass = await this.prisma.sportClass.findUnique({
            where: { id },
            ...(options?.includeRelations && {
                include: {
                    classSchedules: {
                        where: {
                            isActive: true
                        },
                        orderBy: [
                            { dayOfWeek: 'asc' },
                            { startTime: 'asc' }
                        ]
                    },
                }
            })
        });

        if (!sportClass) {
            throw new NotFoundException(`Sports class with ID ${id} not found`);
        }

        return sportClass;
    }

    async update(id: string, updateClassDto: UpdateClassDto): Promise<SportClass> {
        await this.findOne(id);

        const { schedules, ...classData } = updateClassDto;

        try {
            return await this.prisma.sportClass.update({
                where: { id },
                data: classData,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Class with this name already exists for this sport');
                }
            }
            throw error;
        }
    }

    async remove(id: string): Promise<SportClass> {
        await this.findOne(id);

        return await this.prisma.sportClass.delete({
            where: { id }
        });
    }

    async addSchedule(classId: string, createScheduleDto: CreateScheduleDto): Promise<ClassSchedule> {
        await this.findOne(classId);

        const formattedSchedule = {
            ...createScheduleDto,
            startTime: this.convertTimeStringToDate(createScheduleDto.startTime),
            endTime: this.convertTimeStringToDate(createScheduleDto.endTime)
        }

        try {
            return await this.prisma.classSchedule.create({
                data: {
                    ...formattedSchedule,
                    classId
                }
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Schedule already exists for this day and time');
                }
            }
            throw error;
        }
    }

    async findOneSchedule(scheduleId: string): Promise<ClassSchedule> {
        const schedule = await this.prisma.classSchedule.findUnique({
            where: { id: scheduleId }
        });

        if (!schedule) {
            throw new NotFoundException('Schedule not found');
        }

        return schedule;
    }

    async updateSchedule(scheduleId: string, updateScheduleDto: UpdateScheduleDto): Promise<ClassSchedule> {
        await this.findOneSchedule(scheduleId);

         const formattedSchedule = {
            ...updateScheduleDto,
            startTime: updateScheduleDto.startTime ? this.convertTimeStringToDate(updateScheduleDto.startTime) : undefined,
            endTime: updateScheduleDto.endTime ? this.convertTimeStringToDate(updateScheduleDto.endTime) : undefined
        }

        try {
            return await this.prisma.classSchedule.update({
                where: { id: scheduleId },
                data: formattedSchedule
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Schedule already exists for this day and time');
                }
            }
            throw error;
        }
    }

    async removeSchedule(scheduleId: string): Promise<ClassSchedule> {
        await this.findOneSchedule(scheduleId);

        return await this.prisma.classSchedule.delete({
            where: { id: scheduleId }
        });
    }

    async getClassSchedules(classId: string): Promise<ClassSchedule[]> {
        await this.findOne(classId);

        return await this.prisma.classSchedule.findMany({
            where: {
                classId,
                isActive: true
            },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ]
        });
    }
}
