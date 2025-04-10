import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getDefault(): string {
    return 'QVEMA API V1.0';
  }
}
