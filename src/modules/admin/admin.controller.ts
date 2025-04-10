import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/types-dto/user-role.type';

/**
 * AdminController prend en charge les routes liées à l'administration.
 * Il utilise le AdminService pour effectuer des opérations et applique des Guards pour l'authentification et l'autorisation.
 */
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  getDashboard(): string {
    return this.adminService.getDashboard();
  }

  @Get('users')
  @Roles(UserRole.ADMIN)
  getUsersList(): string {
    return this.adminService.getUsersList();
  }

  @Get('projects')
  @Roles(UserRole.ADMIN)
  getProjectsList(): string {
    return this.adminService.getProjectsList();
  }

  @Get('investments')
  @Roles(UserRole.ADMIN)
  getInvestmentsList(): string {
    return this.adminService.getInvestmentsList();
  }
}