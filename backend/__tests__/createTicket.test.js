const request = require('supertest');
const app = require('../server'); // Assuming the Express app is exported from this file
const Organization = require('../models/organizationModel');
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");
const transporter = require ('../middleware/nodeMailer')
const notification = require('../models/notification')

jest.mock('../middleware/nodeMailer', () => ({
  sendMail: jest.fn().mockResolvedValue(true),
}));

jest.mock('../models/userModel');
jest.mock('../models/organizationModel');
jest.mock('../models/ticketModel');
jest.mock('../models/notification');

describe('createTicket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('test_createTicket', async () => {
    const mockUser = { id: 'user123', email: 'user@example.com', name: 'John Doe' };
    const mockOrganization = { id: 'org123', code: 'ORG' };
    const mockTicket = { _id: 'ticket123', ticketID: 'ORG0001' };

    User.findById.mockResolvedValue(mockUser);
    Organization.findById.mockResolvedValue(mockOrganization);
    Ticket.create.mockResolvedValue(mockTicket);
    notification.create.mockResolvedValue(true);

    const response = await request(app)
      .post('/api/tickets/')
      .send({
        project: 'Project A',
        priority: 'High',
        issueType: 'Bug',
        assignedTo: 'user123',
        description: 'Test ticket',
        cc: ['ccUser1'],
        organization: 'org123',
        title: 'Test Ticket',
        status: 'Open',
      });

    expect(response.statusCode).toBe(201);
    expect(transporter.sendMail).toHaveBeenCalledTimes(3); // To user, assigned user, and CC'd user
    expect(notification.create).toHaveBeenCalledTimes(2); // To assigned user and CC'd user
  });

  it('test_createTicket_userNotFound', async () => {
    User.findById.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/tickets/')
      .send({
        project: 'Project A',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('User not found');
  });

  it('test_createTicket_assignedUserOrOrganizationNotFound', async () => {
    const mockUser = { id: 'user123', email: 'user@example.com', name: 'John Doe' };
    User.findById.mockResolvedValueOnce(mockUser); // For the ticket creator
    User.findById.mockResolvedValueOnce(null); // For the assigned user
    Organization.findById.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/tickets')
      .send({
        project: 'Project A',
        assignedTo: 'userNotFound',
        organization: 'orgNotFound',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/not found/);
  });
});