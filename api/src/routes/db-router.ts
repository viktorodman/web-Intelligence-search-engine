import { Router, Request, Response } from 'express'

export default class DBRouter {
    private _router: Router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public get router() {
        return this._router
    }
    

    private initializeRoutes() {
        this._router.get('/', (req: Request, res: Response) => res.status(200).json("TEST"))
    }
}