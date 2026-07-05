import { Injectable } from '@nestjs/common';
import { nativeToScVal } from '@stellar/stellar-sdk';
import { SorobanClientService } from '../common/soroban-client.service';

@Injectable()
export class AgentsService {
  constructor(private readonly soroban: SorobanClientService) {}

  async registerAgent(agentAddress: string, name: string, location: string) {
    return this.soroban.invoke('register_agent', [
      nativeToScVal(agentAddress, { type: 'address' }),
      nativeToScVal(name, { type: 'symbol' }),
      nativeToScVal(location, { type: 'symbol' }),
    ]);
  }

  async isRegistered(agentAddress: string) {
    return this.soroban.invoke('is_agent_registered', [
      nativeToScVal(agentAddress, { type: 'address' }),
    ]);
  }
}
