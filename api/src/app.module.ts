import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgentsModule } from './agents/agents.module';
import { CashoutsModule } from './cashouts/cashouts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AgentsModule,
    CashoutsModule,
  ],
})
export class AppModule {}
