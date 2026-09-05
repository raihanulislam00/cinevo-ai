import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() { return { success: true, message: 'Cinevo AI API', data: { docs: '/api/docs' } }; }
}
