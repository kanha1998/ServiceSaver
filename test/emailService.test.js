const { handleEmailReply } = require('../src/services/emailService');
const connectToDatabase = require('../src/config/dbConfig');
const Service = require('../src/models/serviceModel');

describe('Email Service', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  it('should assign the support person when an email is replied', async () => {
    const service = new Service({ name: 'Test Service', url: 'http://localhost:1234' });
    await service.save();
    
    await handleEmailReply({ from: 'support@example.com', subject: 'Service Alert: Test Service is Down' });
    
    expect(service.assignedTo).toBe('support@example.com');
    expect(service.isAcknowledged).toBe(true);
  });
});
