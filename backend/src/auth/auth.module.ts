import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { ProjectAuthGuard } from './project-auth.guard';

@Module({
  imports: [SupabaseModule],
  providers: [ProjectAuthGuard],
  exports: [ProjectAuthGuard],
})
export class AuthModule {}
