import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';
import { createClient, RedisClient } from 'redis';

@Injectable()
export class RedisService {
  private redisClient: RedisClient;

  constructor(private readonly config: ConfigService) {
    const { host, password, port } = this.config.redis;
    this.redisClient = createClient({ host, password, port });
    this.redisClient.on('ready', () => {
      console.log('Connected to redis...');
    });
  }

  async set(key: string, value: any, durationInSeconds?: number): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    return new Promise<void>((resolve, reject) => {
      const callback = (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      };
      if (durationInSeconds != null) {
        this.redisClient.setex(key, durationInSeconds, stringValue, callback);
      } else {
        this.redisClient.set(key, stringValue, callback);
      }
    });
  }

  async get(key: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const callback = (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      };
      this.redisClient.get(key, callback);
    });
  }

  async getObject<T>(key: string): Promise<T> {
    const stringValue = await this.get(key);
    return JSON.parse(stringValue) as T;
  }

  async delete(key: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const callback = (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      };
      this.redisClient.del(key, callback);
    });
  }
}
