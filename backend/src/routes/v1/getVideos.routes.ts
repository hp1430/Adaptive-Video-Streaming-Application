import express from 'express';
import { getVideosController } from '../../controllers/getVideos.controller';

const getVideosRouter = express.Router();

getVideosRouter.get('/', getVideosController);

export default getVideosRouter;