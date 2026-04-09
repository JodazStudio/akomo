import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createHash } from 'crypto';
import { SupabaseService } from '../supabase/supabase.service';
import { IS_PUBLIC_KEY } from './is-public.decorator';

@Injectable()
export class ProjectAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private supabaseService: SupabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    // Hash the incoming key for comparison
    const keyHash = createHash('sha256').update(apiKey).digest('hex');

    const supabase = this.supabaseService.getClient();
    const { data: project, error } = await supabase
      .from('projects')
      .select('id, name, is_active')
      .eq('key_hash', keyHash)
      .single();

    if (error || !project) {
      throw new UnauthorizedException('Invalid API key');
    }

    if (!project.is_active) {
      throw new UnauthorizedException('Project is inactive');
    }

    // Optional: Attach project info to request
    request['project'] = project;

    // Update last used timestamp (non-blocking)
    supabase
      .from('projects')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', project.id)
      .then();

    return true;
  }
}
