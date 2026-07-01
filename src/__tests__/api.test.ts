import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app, server } from '../src/server';

describe('Auth Routes', () => {
  afterAll(async () => {
    server.close();
  });

  it('should register a new user', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('should login a user', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});

describe('Chat Routes', () => {
  let token: string;

  beforeAll(async () => {
    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    token = loginResponse.body.token;
  });

  it('should create a conversation', async () => {
    const response = await request(app)
      .post('/api/chat/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Conversation',
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Conversation');
  });
});

describe('Testing Routes', () => {
  let token: string;

  beforeAll(async () => {
    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    token = loginResponse.body.token;
  });

  it('should check testing mode status', async () => {
    const response = await request(app)
      .get('/api/testing/status')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('enabled');
  });
});
