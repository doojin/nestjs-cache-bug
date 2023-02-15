import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Controller()
export class AppController {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @Get('/number')
  @UseInterceptors(CacheInterceptor)
  // according to NestJS docs, cache-manager@5 is using milliseconds for TTL
  @CacheTTL(2000)
  getHello(): number {
    return Math.random();
  }

  @Get('/cache')
  async getCacheData(): Promise<any> {
    const keys = await this.cacheManager.store.keys();

    const ttls = {};
    for (const key of keys) {
      // Get TTL of every key in cache
      ttls[key] = await this.cacheManager.store.ttl(key);
    }

    return ttls;
  }
}
