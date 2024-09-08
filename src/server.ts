import { Application } from 'express'
import { router } from './routes/routes'
import express from 'express'
import { app } from './config/app'

export class Server {
  private _app: Application
  private _port: number
  private _version_api: string

  constructor() {
    this._app = express()
    this._port = app.port
    this._version_api = app.version
  }

  middleware() {
    // Put here the middleware functions
  }

  routes() {
    this._app.use(`/api${this._version_api}`, router)
  }

  public startServer() {
    this._app.listen(this._port, () => {
      console.log(`Server running on port ${this._port}`)
    })
  }
}
