import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateCashoutDto {
  @IsString()
  senderAddress: string;

  @IsString()
  tokenContractId: string;

  @IsInt()
  @IsPositive()
  amount: number;

  /** Plaintext secret — the API hashes it before sending to the contract.
   *  Share this string with the recipient out-of-band (SMS/WhatsApp). */
  @IsString()
  secret: string;
}

export class ClaimCashoutDto {
  @IsString()
  agentAddress: string;

  @IsString()
  secret: string;
}
