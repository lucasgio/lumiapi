import request from 'supertest'
import { Server } from '../../src/server'
import { app } from '../../src/config/app'
import { NotFoundError } from '../../src/common/exceptions/NotFoundRequestException'

describe('Server', () => {
  let serverInstance: Server

  beforeAll(() => {
    serverInstance = new Server()
  })

  describe('Core Functionality', () => {
    it('should initialize the server with the correct port and version', () => {
      expect(serverInstance).toBeInstanceOf(Server)
      expect(serverInstance['_port']).toBe(app.port)
      expect(serverInstance['_version_api']).toBe(app.version_api)
    })

    it('should handle a valid route correctly', async () => {
      const response = await request(serverInstance['_app'])
        .get(`/api/${app.version_api}/health`) // Replace with an actual valid endpoint
        .send()

      expect(response.status).toBe(200) // Adjust based on actual behavior
      expect(response.body).toEqual(expect.any(Object)) // Adjust based on the response
    })
  })

  describe('Edge Cases', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(serverInstance['_app'])
        .get(`/api/${app.version_api}/non-existing-route`)
        .send()

      expect(response.status).toBe(404)
      expect(response.body.errors[0].message).toBe('Route not found')
    })
  })

  describe('Error Handling', () => {
    it('should use errorHandler for handling errors', async () => {
      // Simulate an error scenario
      serverInstance['_app'].use((req, res, next) => {
        next(new NotFoundError())
      })

      const response = await request(serverInstance['_app']).get('/api/fake-endpoint').send()

      expect(response.status).toBe(404)
      expect(response.body.errors[0].message).toBe('Route not found')
    })
  })
})
