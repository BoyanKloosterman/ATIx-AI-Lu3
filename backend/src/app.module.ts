import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoryModule } from './infrastructure/repositoy.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserController } from './interfaces/controllers/user.controller';
import { UserService } from './application/services/user.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        DatabaseModule,
        RepositoryModule,
        AuthModule,
    ],
    controllers: [AppController, UserController],
    providers: [AppService, UserService],
})
export class AppModule {}
