import express from 'express'
import DBRouter from './routes/db-router';

export default class Server {
    private _app: express.Application = express();
    private dbRouter: DBRouter = new DBRouter();
    private _port: string | number;

    public constructor(port: string | number) {
        this._port = port;
    }

    public run() {
        this._app.use('/api/db', this.dbRouter.router)
        this.listen()
    }

    private listen() {
        this._app.listen(this._port, () => console.log(`App listening on http://localhost:${this._port}`))
    }
}