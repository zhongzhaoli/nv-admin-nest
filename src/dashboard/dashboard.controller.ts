import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/topFour')
  topFour() {
    return this.dashboardService.topFour();
  }

  @Get('/otherOne')
  otherOne() {
    return this.dashboardService.otherOne();
  }

  @Get('/otherTwo')
  otherTwo() {
    return this.dashboardService.otherTwo();
  }

  @Get('/otherThree')
  otherThree() {
    return this.dashboardService.otherThree();
  }

  @Get('/otherFour')
  otherFour() {
    return this.dashboardService.otherFour();
  }

  @Get('/otherFive')
  otherFive() {
    return this.dashboardService.otherFive();
  }

  @Get('/otherSix')
  otherSix() {
    return this.dashboardService.otherSix();
  }
}
