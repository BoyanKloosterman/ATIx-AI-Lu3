import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { Types } from 'mongoose';
import { Module } from '../../domain/entities/module.entity';
import type { IModuleRepository } from '../../domain/repositories/module.repository.interface';

@Injectable()
export class ModuleService {
    constructor(
        @Inject('IModuleRepository') private readonly moduleRepository: IModuleRepository,
    ) {}

    async findAll(): Promise<Module[]> {
        return await this.moduleRepository.findAll();
    }

    async findById(id: string): Promise<Module | null> {
        if (!id || typeof id !== 'string') {
            throw new BadRequestException('Invalid module id');
        }

        const trimmedId = id.trim();
        if (!trimmedId || !Types.ObjectId.isValid(trimmedId)) {
            throw new BadRequestException('Invalid module id');
        }

        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid ID format');
        }

        return await this.moduleRepository.findById(trimmedId);
    }

    async findByExternalId(externalId: number): Promise<Module | null> {
        const module = await this.moduleRepository.findByExternalId(externalId);
        if (!module) {
            throw new BadRequestException('Module with this external ID doesnt exists');
        }
        return module;
    }

    async search(query: string): Promise<Module[]> {
        return await this.moduleRepository.search(query);
    }

    async getAllTags(): Promise<string[]> {
        return await this.moduleRepository.getAllTags();
    }
}
