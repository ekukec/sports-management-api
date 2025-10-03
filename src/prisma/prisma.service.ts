import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {PrismaClient} from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() { 
        super({
            log:['query', 'info', 'warn', 'error']
        })
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    exclude<T, Key extends keyof T>(entity: T, keys: Key[]): Omit<T, Key> {
        for(const key of keys){
            delete entity[key];
        }
        return entity;
    }
}