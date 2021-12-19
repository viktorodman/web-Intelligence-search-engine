import express from 'express'
import DBController from './controllers/db-controller';
import PageDB from './models/page-db';
import { createDB } from './utils/create-db';

export default class Server {
    private _app: express.Application = express();
    private dbController: DBController = new DBController();
    private _port: string | number;
    private test = "hello";
    private db: PageDB = new PageDB();

    public constructor(port: string | number) {
        this._port = port;
    }

    public async run() {
        this.db = await createDB();

        this._app.use('/api/db', (req, res) => this.dbController.searchDB(req, res, this.db))


        this.listen()
    }

    private listen() {
        this._app.listen(this._port, () => console.log(`App listening on http://localhost:${this._port}`))
    }
}