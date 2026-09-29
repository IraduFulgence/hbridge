import { Controller, Get } from "@nestjs/common";
import { uptime } from "process";
import { ConfigService } from "@nestjs/config";
//import { PrismaService } from "./prisma/prisma.service.js";
import { Public } from '../../common/decorators/public.decorator.js';
import { PrismaService } from "../../prisma/prisma.service.js";
@Controller('health')
export class HealthController{
    constructor(private readonly config: ConfigService,
        private readonly prisma: PrismaService,
    ) {}
    @Public()
    @Get()
    async check() {
        let userCount =0;
        let dbStatus = 'disconnected';

        try {
            userCount = await this.prisma.user.count();
            dbStatus = 'connected';
        } catch (error) {
            dbStatus = 'error';
        }

        return {
      status: 'ok',
      service: this.config.get<string>('app.name'),
      env: this.config.get<string>('app.env'),
      database: {
        status: dbStatus,
        userCount,
      },
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
       
        };
    }

}