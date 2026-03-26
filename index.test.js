const request = require('supertest');
const app = require('./index');

describe('GET /', () => {
  it('returns a 200 with status ok', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.message).toBe('API is running');
  });
});

describe('GET /users/:id', () => {
  it('returns 200 with user data for a valid user id', async () => {
    const res = await request(app).get('/users/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.name).toBe('Alice');
  });

  it('returns 404 for a user id that does not exist', async () => {
    const res = await request(app).get('/users/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  it('does not return a 500 error', async () => {
    const res = await request(app).get('/users/1');
    expect(res.statusCode).not.toBe(500);
  });
});
