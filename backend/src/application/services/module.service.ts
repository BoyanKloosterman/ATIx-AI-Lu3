import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
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
        return await this.moduleRepository.findById(id);
    }

    async findByExternalId(externalId: number): Promise<Module | null> {
        return await this.moduleRepository.findByExternalId(externalId);
    }

    async search(query: string): Promise<Module[]> {
        // Extra validatie laag voor XSS bescherming
        if (!query || typeof query !== 'string') {
            throw new BadRequestException('Invalid search query');
        }
        
        // Sanitize query: verwijder gevaarlijke MongoDB operators en speciale tekens
        const sanitizedQuery = this.sanitizeSearchQuery(query);
        
        return await this.moduleRepository.search(sanitizedQuery);
    }

    private sanitizeSearchQuery(query: string): string {
        // Verwijder MongoDB operators die kunnen worden misbruikt
        // $text search accepteert alleen strings, maar we willen zeker zijn
        let sanitized = query.trim();
        
        // Verwijder gevaarlijke tekens die kunnen worden gebruikt voor injection
        // MongoDB $text search is relatief veilig, maar we sanitizen voor extra beveiliging
        // Toegestaan: letters, cijfers, spaties, en enkele speciale tekens voor zoeken
        sanitized = sanitized.replace(/[<>{}[\]$]/g, '');
        
        // Normaliseer meerdere spaties naar één spatie
        sanitized = sanitized.replace(/\s+/g, ' ');
        
        return sanitized;
    }

    async getAllTags(): Promise<string[]> {
        return await this.moduleRepository.getAllTags();
    }
}
