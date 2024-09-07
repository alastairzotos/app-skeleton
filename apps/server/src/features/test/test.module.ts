import { Module } from '@nestjs/common';
import { TestController } from 'features/test/test.controller';

@Module({
  controllers: [TestController]
})
export class TestModule {}
