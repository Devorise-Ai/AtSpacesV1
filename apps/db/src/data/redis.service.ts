import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    onModuleInit() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
        });
    }

    onModuleDestroy() {
        this.client.disconnect();
    }

    /**
     * Locks a service for a specific duration during checkout.
     * @param serviceId The ID of the service to lock
     * @param customerId The ID of the customer booking
     * @param durationMinutes Time the lock is held (default 10 mins)
     */
    async lockService(serviceId: string, customerId: string, durationMinutes: number = 10): Promise<boolean> {
        const key = `lock:service:${serviceId}`;
        const result = await this.client.set(key, customerId, 'EX', durationMinutes * 60, 'NX');
        return result === 'OK';
    }

    /**
     * Unlocks a service, ensuring only the owner can unlock it.
     */
    async unlockService(serviceId: string, customerId: string): Promise<boolean> {
        const key = `lock:service:${serviceId}`;
        const owner = await this.client.get(key);
        if (owner === customerId) {
            await this.client.del(key);
            return true;
        }
        return false;
    }

    /**
     * Updates the real-time status of a branch (Calm, Moderate, Busy).
     */
    async updateBranchState(branchId: string, status: string) {
        const key = `branch:state:${branchId}`;
        await this.client.set(key, status);
    }

    async getBranchState(branchId: string): Promise<string | null> {
        const key = `branch:state:${branchId}`;
        return await this.client.get(key);
    }
}
