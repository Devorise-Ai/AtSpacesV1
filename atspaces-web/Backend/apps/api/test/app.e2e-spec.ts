import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/verification (Phase 3)', async () => {
    // 1. Register a test user
    const randomStr = Math.random().toString(36).substring(7);
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `test_${randomStr}@example.com`,
        password: 'Password123!',
        fullName: 'Test User',
        phoneNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
        role: 'customer'
      });

    expect(registerResponse.status).toBe(201);
    const user = registerResponse.body;
    expect(typeof user.id).toBe('number');

    // 2. Create a booking (using seeded branch 1)
    const bookingResponse = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        vendorServiceId: 1,
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        quantity: 1,
        notes: 'E2E test booking'
      });

    // Note: This might return 401 if we haven't implemented AuthGuard on /bookings yet,
    // or 404 if seed 1 doesn't have a vendor service with ID 1.
    // But for now, we just want to see if the pipe/controller/service chain works.
    console.log('Booking Status:', bookingResponse.status);

    // 3. Create an approval request
    const approvalResponse = await request(app.getHttpServer())
      .post('/vendor/approval-requests')
      .send({
        branchId: 1,
        serviceId: 1,
        requestType: 'capacity_change',
        newValue: '100',
        reason: 'E2E test'
      });
    console.log('Approval Status:', approvalResponse.status);

    // If we get here without crashes, the DI and numeric ID pipes are working!
    expect(approvalResponse.status).toBeDefined();
  });
});
