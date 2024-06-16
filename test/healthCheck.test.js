const { performHealthCheck } = require('../src/services/healthService');
const connectToDatabase = require('../src/config/dbConfig');
const Service = require('../src/models/serviceModel');

jest.mock('../src/services/emailService', () => ({
  sendAlert: jest.fn()
}));

describe('Health Check', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  it('should send an alert if the service is down', async () => {
    const service = new Service({ name: 'Test Service', url: 'http://localhost:1234', lastAlert: new Date(0) });
    await service.save();
    
    await performHealthCheck();
    
    expect(service.lastAlert).not.toBeNull();
  });
});
