import { Injectable } from '@nestjs/common';
import { nativeToScVal } from '@stellar/stellar-sdk';
import { SorobanClientService } from '../common/soroban-client.service';
import { sha256Hex } from '../common/hash.util';

@Injectable()
export class CashoutsService {
  constructor(private readonly soroban: SorobanClientService) {}

  async createCashoutRequest(
    senderAddress: string,
    tokenContractId: string,
    amount: number,
    secret: string,
  ) {
    const secretHash = sha256Hex(secret);
    return this.soroban.invoke('create_cashout_request', [
      nativeToScVal(senderAddress, { type: 'address' }),
      nativeToScVal(tokenContractId, { type: 'address' }),
      nativeToScVal(amount, { type: 'i128' }),
      nativeToScVal(secretHash, { type: 'bytes' }),
    ]);
  }

  async claimCashout(requestId: number, agentAddress: string, secret: string) {
    return this.soroban.invoke('claim_cashout', [
      nativeToScVal(agentAddress, { type: 'address' }),
      nativeToScVal(requestId, { type: 'u32' }),
      nativeToScVal(Buffer.from(secret, 'utf8'), { type: 'bytes' }),
    ]);
  }

  async getRequest(requestId: number) {
    return this.soroban.invoke('get_request', [nativeToScVal(requestId, { type: 'u32' })]);
  }
}
