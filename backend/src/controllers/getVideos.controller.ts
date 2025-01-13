import { Request, Response } from 'express'
import { getVideos } from "../services/getVideos.service";

export const getVideosController = async (_: Request, res: Response) => {
    const response = await getVideos();
    res.status(200).json(response);
    return;
}