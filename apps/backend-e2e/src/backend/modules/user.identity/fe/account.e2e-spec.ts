import axios from 'axios';

describe('FE AccountController (e2e)', () => {
  const baseUrl = '/api/fe/account';
  const tenantId = '7e3bb2d8-d877-456e-a74e-260ca38823a3';
  const username = 'e2e_user_' + Date.now();
  const password = 'e2ePass123!';

  it('should register a new user', async () => {
    const res = await axios.post(baseUrl + '/register', {
      username,
      pw: password,
      currencies: ['USD']
    }, {
      headers: { 'x-api-key': tenantId },
      validateStatus: () => true,
    });
    expect([201, 200]).toContain(res.status); // 根據實際 controller 設定
    expect(res.data).toHaveProperty('accessToken');
    expect(typeof res.data.accessToken).toBe('string');
  });

  it('should login with registered user', async () => {
    const res = await axios.post(baseUrl + '/login', {
      username,
      pw: password,
    }, {
      headers: { 'x-api-key': tenantId },
      validateStatus: () => true,
    });
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('accessToken');
    expect(typeof res.data.accessToken).toBe('string');
  });

  it('should fail login with wrong password', async () => {
    const res = await axios.post(baseUrl + '/login', {
      username,
      pw: 'wrongPassword',
    }, {
      headers: { 'x-api-key': tenantId },
      validateStatus: () => true,
    });
    expect(res.status).toBe(400);
    expect(res.data).toHaveProperty('message');
    expect(res.data).toHaveProperty('errorCode');
  });

  it('should fail register with existing username', async () => {
    const res = await axios.post(baseUrl + '/register', {
      username,
      pw: password,
    }, {
      headers: { 'x-api-key': tenantId },
      validateStatus: () => true,
    });
    expect(res.status).toBe(400);
    expect(res.data).toHaveProperty('message');
    expect(res.data).toHaveProperty('errorCode');
  });
});
