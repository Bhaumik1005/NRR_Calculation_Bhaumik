import { Controller, Get, Post, Body } from '@nestjs/common';
import { PointsService } from './points.service';
import { CalculateNRRDto } from './dto/calculate-nrr.dto';

@Controller()
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('points-table')
  getPointsTable() {
    return this.pointsService.getPointsTable();
  }

  @Post('calculate-nrr')
  calculateNRR(@Body() dto: CalculateNRRDto) {
    return this.pointsService.calculateNRR(dto);
  }
}
