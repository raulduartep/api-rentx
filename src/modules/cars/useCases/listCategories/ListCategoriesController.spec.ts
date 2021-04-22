import 'reflect-metadata';
import { hash } from 'bcrypt';
import { RedisClient } from 'redis';
import request from 'supertest';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;
let token: string;
const redisClient = container.resolve<RedisClient>('RedisClient');

describe('Create Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, driver_license, password, is_admin, created_at)
        values('${id}', 'admin', 'admin@rentx.com.br', 'ADS123' ,'${password}', true, 'now()')
      `
    );

    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    token = responseToken.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await new Promise<void>(resolve => {
      redisClient.quit(() => {
        resolve();
      });
    });
  });

  it('Should be able to list all categories', async () => {
    await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Category Supertest',
        }),
      ])
    );
  });
});
