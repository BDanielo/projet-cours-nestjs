import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateUserInterestsDto } from './dto/update-user-interests.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/types-dto/user-role.type';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Get()
  findAll() {
    return this.interestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interestsService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createInterestDto: CreateInterestDto) {
    return this.interestsService.create(createInterestDto);
  }

  @Post('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  addInterestsToUser(
    @Param('userId') userId: string,
    @Body() updateUserInterestsDto: UpdateUserInterestsDto,
  ) {
    return this.interestsService.addInterestsToUser(
      userId,
      updateUserInterestsDto.interestIds,
    );
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  getUserInterests(@Param('userId') userId: string) {
    return this.interestsService.getUserInterests(userId);
  }

  @Get('recommended/user/:userId')
  @UseGuards(AuthGuard('jwt'))
  getRecommendedProjects(@Param('userId') userId: string) {
    return this.interestsService.getRecommendedProjects(userId);
  }
}