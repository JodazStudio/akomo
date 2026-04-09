import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { IsPublic } from './auth/is-public.decorator';

@ApiTags('Status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @IsPublic()
  @Get()
  @ApiOperation({ summary: 'API Health Check' })
  getHello(): string {
    return this.appService.getHello();
  }
}
