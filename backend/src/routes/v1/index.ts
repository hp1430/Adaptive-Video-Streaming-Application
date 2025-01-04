import express, { Request, Response } from 'express';
import videoRouter from './video.routes';

const v1Router = express.Router();

v1Router.use('/videos', videoRouter);

v1Router.get("/ping", (_req: Request, res: Response) => {
    res.send("pong");
});

export default v1Router;