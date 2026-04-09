import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangeRatesModule } from './exchange-rates/exchange-rates.module';
import { SupabaseModule } from './supabase/supabase.module';
import { BuildsModule } from './builds/builds.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ProjectAuthGuard } from './auth/project-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    ExchangeRatesModule,
    BuildsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ProjectAuthGuard,
    },
  ],
})
export class AppModule {}
