import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Contract,
  Keypair,
  rpc,
  TransactionBuilder,
  Networks,
  nativeToScVal,
  scValToNative,
} from '@stellar/stellar-sdk';

/**
 * Shared helper for invoking the RemitLastMile Soroban contract.
 *
 * IMPORTANT — same caveat as the other Baobab Labs API scaffolds: this
 * signs transactions with a single service keypair. Fine for a testnet
 * demo. In production, `create_cashout_request` should be signed by the
 * sender's own wallet and `claim_cashout` by the agent's own wallet —
 * this service should only relay already-signed transactions. See ISSUES.md.
 */
@Injectable()
export class SorobanClientService {
  private readonly logger = new Logger(SorobanClientService.name);
  private readonly server: rpc.Server;
  private readonly contractId: string;
  private readonly networkPassphrase: string;
  private readonly serviceKeypair: Keypair;

  constructor(private readonly config: ConfigService) {
    this.server = new rpc.Server(
      this.config.get<string>('SOROBAN_RPC_URL', 'https://soroban-testnet.stellar.org'),
    );
    this.contractId = this.config.getOrThrow<string>('CONTRACT_ID');
    this.networkPassphrase = this.config.get<string>('NETWORK_PASSPHRASE', Networks.TESTNET);
    const secret = this.config.getOrThrow<string>('SERVICE_ACCOUNT_SECRET');
    this.serviceKeypair = Keypair.fromSecret(secret);
  }

  async invoke(method: string, args: ReturnType<typeof nativeToScVal>[]) {
    const contract = new Contract(this.contractId);
    const account = await this.server.getAccount(this.serviceKeypair.publicKey());

    let tx = new TransactionBuilder(account, {
      fee: '100000',
      networkPassphrase: this.networkPassphrase,
    })
      .addOperation(contract.call(method, ...args))
      .setTimeout(30)
      .build();

    tx = await this.server.prepareTransaction(tx);
    tx.sign(this.serviceKeypair);

    const result = await this.server.sendTransaction(tx);

    if (result.status === 'ERROR') {
      this.logger.error(`Contract call ${method} failed`, result.errorResult);
      throw new Error(`Contract call ${method} failed`);
    }

    return this.pollForResult(result.hash);
  }

  private async pollForResult(hash: string) {
    for (let attempt = 0; attempt < 10; attempt++) {
      const tx = await this.server.getTransaction(hash);
      if (tx.status === 'SUCCESS') {
        return tx.returnValue ? scValToNative(tx.returnValue) : null;
      }
      if (tx.status === 'FAILED') {
        throw new Error(`Transaction ${hash} failed`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    throw new Error(`Timed out waiting for transaction ${hash}`);
  }

  get servicePublicKey(): string {
    return this.serviceKeypair.publicKey();
  }
}
