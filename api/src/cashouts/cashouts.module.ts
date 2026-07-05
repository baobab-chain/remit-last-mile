import { Module } from '@nestjs/common';
import { CashoutsController } from './cashouts.controller';
import { CashoutsService } from './cashouts.service';
import { SorobanClientService } from '../common/soroban-client.service';

@Module({
  controllers: [CashoutsController],
  providers: [CashoutsService, SorobanClientService],
})
export class CashoutsModule {}
