import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { RegisterAgentDto } from './dto/agents.dto';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  register(@Body() dto: RegisterAgentDto) {
    return this.agentsService.registerAgent(dto.agentAddress, dto.name, dto.location);
  }

  @Get(':address/registered')
  isRegistered(@Param('address') address: string) {
    return this.agentsService.isRegistered(address);
  }
}
