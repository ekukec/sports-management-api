import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSportDto, UpdateSportDto } from './dto';
import { Prisma, Sport } from '@prisma/client';

@Injectable()
export class SportsService {
    constructor(private prisma: PrismaService){}

    async create(createSportDto: CreateSportDto): Promise<Sport>{
        try {
            return await this.prisma.sport.create({
                data: createSportDto
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Sport with this name already exists');
                }   
            }
            throw error;
        }
    }

    async findAll(isActive?: boolean): Promise<Sport[]> {
        const where: Prisma.SportWhereInput = {};
        
        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        return await this.prisma.sport.findMany({
            where,
            orderBy: {
                name: 'asc'
            }
        });
    }

    async findOne(id: string): Promise<Sport> {
        const sport = await this.prisma.sport.findUnique({
            where: { id },
        });

        if (!sport) {
            throw new NotFoundException(`Sport with ID ${id} not found`);
        }

        return sport;
    }

    async update(id: string, updateSportDto: UpdateSportDto): Promise<Sport> {
        await this.findOne(id);

        try {
            return await this.prisma.sport.update({
                where: { id },
                data: updateSportDto
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Sport with this name already exists');
                }
            }
            throw error;
        }
    }

    async remove(id: string): Promise<Sport> {
        await this.findOne(id);

        return await this.prisma.sport.delete({
            where: { id }
        });
    }

    async toggleActive(id: string): Promise<Sport> {
        const sport = await this.findOne(id);

        return await this.prisma.sport.update({
            where: { id },
            data: {
                isActive: !sport.isActive
            }
        });
    }
}
