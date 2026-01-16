import { Module } from '@nestjs/common';
import { RepositoryModule } from '../infrastructure/repositoy.module';

@Module({
    imports: [RepositoryModule],
    controllers: [],
    providers: [],
})
export class ApplicationModule {}
