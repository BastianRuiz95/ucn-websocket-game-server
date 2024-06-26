import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './strategies/jwt.strategy';

import { ConfigModule } from '../../config/config.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [PassportModule, ConfigModule, DatabaseModule],
  providers: [JwtStrategy],
})
export class AuthModule {}
