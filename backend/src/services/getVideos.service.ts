import { getCompletedMovies } from "../repositories/movie.repository";

export const getVideos = async () => {
    const response = await getCompletedMovies();
    return response;
}