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
}
