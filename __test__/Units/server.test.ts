import request from 'supertest';
import { Server } from '../../src/server';
import { Application } from 'express';

describe('Server', () => {
  let server: Server;
  let app: Application;

  beforeEach(() => {
    server = new Server();
    app = server['_app'];
  });

  it('should initialize with correct port and version', () => {
    expect(server['_port']).toBeDefined();
    expect(server['_version_api']).toBeDefined();
  });

  it('should use the correct routes', () => {
    const useSpy = jest.spyOn(app, 'use');
    server.routes();
    expect(useSpy).toHaveBeenCalledWith(`/api${server['_version_api']}`, expect.anything());
  });


  it('should not start the server if not in development mode', () => {
    process.env.NODE_ENV = 'production';
    const listenSpy = jest.spyOn(app, 'listen');

    server.startServer();
    expect(listenSpy).not.toHaveBeenCalled();
  });
});

describe('Routes', () => {
  let app: Application;
  let server: Server;

  beforeAll(() => {
    server = new Server();
    server.middleware(); 
    server.routes(); 
    app = server['_app'];
  });

  it('should respond with 200 on the API version route', async () => {
    const response = await request(app).get(`/api${server['_version_api']}/`);
    expect(response.status).toBe(200);
  });
});