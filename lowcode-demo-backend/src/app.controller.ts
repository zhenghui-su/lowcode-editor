import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('data')
  data() {
    return [
      { name: '小明', sex: '男', birthday: new Date('1994-07-07').getTime() },
      { name: '东东', sex: '男', birthday: new Date('1995-06-06').getTime() },
      { name: '小红', sex: '女', birthday: new Date('1996-08-08').getTime() },
    ];
  }
  @Get('xAxisData')
  xAxisData() {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', '11'];
  }
  @Get('yAxisData')
  yAxisData() {
    return [150, 230, 224, 218, 135, 147, 700];
  }
  @Get('pieAxisData')
  pieAxisData() {
    return [
      {
        value: 1048,
        name: 'Search Engine',
      },
      {
        value: 735,
        name: 'Direct',
      },
      {
        value: 580,
        name: 'Email',
      },
      {
        value: 484,
        name: 'Union Ads',
      },
      {
        value: 800,
        name: 'Hello',
      },
    ];
  }
  @Get('scatterAxisData')
  scatterAxisData() {
    return [
      [40, 8.04],
      [8.07, 6.95],
      [13, 7.58],
      [9.05, 8.81],
      [11, 8.33],
      [14, 7.66],
      [13.4, 6.81],
      [10, 6.33],
      [14, 8.96],
      [12.5, 6.82],
      [9.15, 7.2],
      [11.5, 7.2],
      [3.03, 4.23],
      [12.2, 7.83],
      [2.02, 4.47],
      [1.05, 3.33],
      [4.05, 4.96],
      [6.03, 7.24],
      [12, 6.26],
      [12, 8.84],
      [7.08, 5.82],
      [5.02, 5.68],
    ];
  }
  @Get('radarIndicatorData')
  radarIndicatorData() {
    return [
      {
        name: '111',
        max: 6500,
      },
      {
        name: '222',
        max: 16000,
      },
      {
        name: '222 Technology',
        max: 30000,
      },
      {
        name: 'Customer Support',
        max: 38000,
      },
      {
        name: 'Development',
        max: 52000,
      },
      {
        name: 'Marketing',
        max: 25000,
      },
    ];
  }
  @Get('radarData')
  radarData() {
    return [
      {
        value: [4200, 9000, 20000, 35000, 50000, 18000],
        name: 'Allocated Budget',
      },
      {
        value: [5000, 14000, 28000, 26000, 42000, 21000],
        name: 'Actual Spending',
      },
    ];
  }
}
