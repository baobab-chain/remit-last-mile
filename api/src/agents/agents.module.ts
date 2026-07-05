import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { SorobanClientService } from '../common/soroban-client.service';

@Module({
  controllers: [AgentsController],
  providers: [AgentsService, SorobanClientService],
})
export class AgentsModule {}
