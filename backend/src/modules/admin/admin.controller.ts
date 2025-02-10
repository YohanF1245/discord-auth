import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt-cookie'))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('populate')
  async populateDatabase(@Req() req: any) {
    return this.adminService.populateDatabase(req.user.sub);
  }
} 