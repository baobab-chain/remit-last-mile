import { IsString } from 'class-validator';

export class RegisterAgentDto {
  @IsString()
  agentAddress: string;

  @IsString()
  name: string;

  @IsString()
  location: string;
}
