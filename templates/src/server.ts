import express, { Application, Request, Response } from 'express';
import { router } from './routes/routes';
import { app } from './config/app';
import { LoggerHelper } from './utils/LoggerHelper';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './common/exceptions/NotFoundRequestException';

export class Server {
  private _app: Application;
  private _port: number;
  private _version_api: string;

  constructor() {
    this._app = express();
    this._port = app.port;
    this._version_api = app.version_api;
    this.initializeServer();
  }

  initializeServer() {
    this.routes();
    this.setupMiddlewares();
    this._app.use(errorHandler);
  }

  private setupMiddlewares() {
    this._app.use(express.json());
    this._app.all('*', (req: Request, res: Response, next) => {
      next(new NotFoundError());
    });
  }

  private routes() {
    this._app.use(`/api/${this._version_api}`, router);
  }

  public startServer() {
    this._app.listen(this._port, () => {
      LoggerHelper.logInfo(`Server running on port: ${this._port}`);
    });
  }
}
