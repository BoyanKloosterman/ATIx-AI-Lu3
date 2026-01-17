import { Controller, Get, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ModuleService } from '../../application/services/module.service';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt.auth.guard';
import { get } from 'mongoose';

@Controller('api/modules')
@UseGuards(JwtAuthGuard)
export class ModuleController {
    constructor(private readonly moduleService: ModuleService) {}

    @Get('search')
    async search(@Query('q') query: string) {
        if (!query) {
            return await this.moduleService.findAll();
        }

        // Valideer en sanitize query om XSS te voorkomen
        if (typeof query !== 'string') {
            throw new BadRequestException('Query must be a string');
        }

        // Trim en controleer lengte
        const trimmedQuery = query.trim();
        if (trimmedQuery.length === 0) {
            return await this.moduleService.findAll();
        }

        // Maximale lengte om DoS te voorkomen
        const MAX_QUERY_LENGTH = 200;
        if (trimmedQuery.length > MAX_QUERY_LENGTH) {
            throw new BadRequestException(`Query too long (max ${MAX_QUERY_LENGTH} characters)`);
        }

        return await this.moduleService.search(trimmedQuery);
    }

    @Get('getAllTags')
    async getAllTags() {
        return await this.moduleService.getAllTags();
    }

    @Get()
    async findAll() {
        return await this.moduleService.findAll();
    }

    @Get('external/:externalId')
    async findByExternalId(@Param('externalId') externalId: string) {
        const module = await this.moduleService.findByExternalId(Number(externalId));
        if (!module) {
            return null;
        }
        return module;
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.moduleService.findById(id);
    }
}
