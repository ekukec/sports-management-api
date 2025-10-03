import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterUsersDto, UpdateUserDto } from './dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findAll(filterDto: FilterUsersDto) {
        const { email, firstName, lastName, role } = filterDto;
        
        const where: Prisma.UserWhereInput = {};
        
        if (email) {
            where.email = {
                contains: email,
                mode: 'insensitive'
            };
        }

        if (firstName) {
            where.firstName = {
                contains: firstName,
                mode: 'insensitive'
            };
        }

        if (lastName) {
            where.lastName = {
                contains: lastName,
                mode: 'insensitive'
            };
        }

        if (role) where.role = role;
        // if (isActive !== undefined) where.isActive = isActive;

        const users = await this.prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return users;
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        await this.findOne(id);

        const { password, ...data } = updateUserDto;

        const updateData: any = data;

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (updateUserDto.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email }
            });

            if (existingUser && existingUser.id !== id) {
                throw new ConflictException('Email already in use');
            }
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return updatedUser;
    }

    async remove(id: string) {
        await this.findOne(id);

        await this.prisma.user.delete({
            where: { id }
        });

        return { message: 'User deleted successfully' };
    }
}
