import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CashoutsService } from './cashouts.service';
import { CreateCashoutDto, ClaimCashoutDto } from './dto/cashouts.dto';

@Controller('cashouts')
export class CashoutsController {
  constructor(private readonly cashoutsService: CashoutsService) {}

  @Post()
  create(@Body() dto: CreateCashoutDto) {
    return this.cashoutsService.createCashoutRequest(
      dto.senderAddress,
      dto.tokenContractId,
      dto.amount,
      dto.secret,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cashoutsService.getRequest(id);
  }

  @Post(':id/claim')
  claim(@Param('id', ParseIntPipe) id: number, @Body() dto: ClaimCashoutDto) {
    return this.cashoutsService.claimCashout(id, dto.agentAddress, dto.secret);
  }
}
