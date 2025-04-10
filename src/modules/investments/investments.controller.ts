import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/types-dto/user-role.type';

@Controller('investments')
@UseGuards(AuthGuard('jwt'))
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.INVESTOR)
  create(@Body() createInvestmentDto: CreateInvestmentDto, @Request() req) {
    return this.investmentsService.create(createInvestmentDto, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.INVESTOR)
  findAll(@Request() req) {
    return this.investmentsService.findAllByInvestor(req.user.id);
  }

  @Get('project/:projectId')
  getProjectInvestments(@Param('projectId') projectId: string, @Request() req) {
    return this.investmentsService.findByProject(projectId, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.INVESTOR)
  remove(@Param('id') id: string, @Request() req) {
    return this.investmentsService.remove(id, req.user.id);
  }
}