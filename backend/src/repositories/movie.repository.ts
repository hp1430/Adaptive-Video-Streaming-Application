import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const createMovie = async(movieId: string) => {
    const response = prisma.movie.create({
        data: {
            movieId,
            processingStatus: "PENDING"
        }
    });
    return response;
}

export const updateMovieStatus = async (movieId: string, status: string) => {
    const response = await prisma.movie.update({
        where: {
            movieId
        },
        data: {
            processingStatus: status
        }
    });

    return response;
}

export const getCompletedMovies = async () => {
    const response = await prisma.movie.findMany({
        select: {
            movieId: true
        }
    });
    console.log(response);
    return response;
}