import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Allow accessing generated model delegates (e.g. prisma.department) even if
  // the generated client types are not available at compile time in some
  // environments (CI/build). This is a small, safe escape hatch.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
