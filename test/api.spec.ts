import axios from 'axios';
const baseUrl = 'http://localhost:3000';

describe('API Tests', () => {
  let authToken: string;

  // Optional: Login to get auth token
  // beforeAll(async () => {
  //   try {
  //     const response = await axios.post(`${baseUrl}/auth/login`, {
  //       email: 'test@example.com',
  //       password: 'password123'
  //     });
  //     authToken = response.data.access_token;
  //   } catch (error) {
  //     console.error('Login failed:', error.message);
  //   }
  // });

  test('Server is running', async () => {
    try {
      const response = await axios.get(baseUrl);
      expect(response.status).toBe(200);
      console.log('Server response:', response.data);
    } catch (error: any) {
      console.error('Error:', error.message);
      throw error; // Re-throw to fail the test
    }
  });

  test('GET /metrics endpoint works', async () => {
    try {
      const response = await axios.get(`${baseUrl}/metrics`);
      expect(response.status).toBe(200);
      console.log('Metrics response status:', response.status);
    } catch (error: any) {
      console.error('Metrics error:', error.message);
      throw error;
    }
  });

  // Uncomment to test authenticated endpoints
  // test('GET /notifications endpoint works with auth', async () => {
  //   try {
  //     const response = await axios.get(`${baseUrl}/notifications`, {
  //       headers: { Authorization: `Bearer ${authToken}` }
  //     });
  //     expect(response.status).toBe(200);
  //     console.log('Notifications count:', response.data.length);
  //   } catch (error: any) {
  //     console.error('Notifications error:', error.message);
  //     throw error;
  //   }
  // });

  // Add more tests for other endpoints
}); 