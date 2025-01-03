import express, { Express, Request, Response } from 'express';

const app : Express = express();

app.get("/ping", (_req: Request, res: Response) => {
    res.send("pong");
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});