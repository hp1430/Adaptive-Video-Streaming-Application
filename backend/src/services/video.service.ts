import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { createMovie, updateMovieStatus } from '../repositories/movie.repository';

interface Resolution {
    width: number;
    height: number;
    bitRate: number;
}

const resolutions: Resolution[] = [
    { width: 1920, height: 1080, bitRate: 2000 },   // 1080p
    { width: 1280, height: 720, bitRate: 1000 },    // 720p
    { width: 854, height: 480, bitRate: 500 },      // 480p
    { width: 640, height: 360, bitRate: 400 },      // 360p
];

export const processVideoForHls = (
    inputPath: string, 
    outputPath: string, 
    callback: (error: Error | null, masterPlayList?: string) => void) : void => {

        createMovie(outputPath);

        fs.mkdirSync(outputPath, { recursive: true });    // create output directory

        const masterPlaylist = `${outputPath}/master.m3u8`; // master playlist path

        const masterContent : string[] = [];    // master playlist content

        let countProcessing = 0;

        resolutions.forEach((resolution) => {

            console.log(`Processing video for resolution: ${resolution.width}x${resolution.height}`);

            const variantOutput = `${outputPath}/${resolution.height}p`;  // variant output path

            const variantPlaylist = `${variantOutput}/playlist.m3u8`;  // variant playlist path

            fs.mkdirSync(variantOutput, { recursive: true });    // create variant output directory
            //fs.writeFileSync(masterPlaylist, `#EXTM3U\n`);

            ffmpeg(inputPath)
                .outputOptions([
                    `-vf scale=w=${resolution.width}:h=${resolution.height}`,
                    `-b:v ${resolution.bitRate}k`,
                    '-codec:v libx264',
                    '-codec:a aac',
                    '-hls_time 10',
                    '-hls_playlist_type vod',
                    `-hls_segment_filename ${variantOutput}/segment%03d.ts`
                ])
                .output(variantPlaylist)      // output to the variant playlist file
                .on('end', () => {
                    // when the processing ends, add the variant playlist to the master playlist
                    // fs.appendFileSync(masterPlaylist, `#EXT-X-STREAM-INF:BANDWIDTH=${resolution.bitRate*1000},RESOLUTION=${resolution.width}x${resolution.height}\n${resolution.height}p/playlist.m3u8\n`)
                    masterContent.push(
                        `#EXT-X-STREAM-INF:BANDWIDTH=${(resolution.bitRate + 128) * 1.25 * 1000},RESOLUTION=${resolution.width}x${resolution.height}\n${resolution.height}p/playlist.m3u8`                    
                    );
                    countProcessing += 1;

                    if(countProcessing === resolutions.length) {
                        console.log('All resolutions processed');
                        console.log(masterContent)
                        // when all resolutions are processed, write the master playlist
                        fs.writeFileSync(masterPlaylist, `#EXTM3U\n${masterContent.join('\n')}`);

                        updateMovieStatus(outputPath, "COMPLETED");

                        callback(null, masterPlaylist); // call the callback with the master playlist path
                    }
                })
                .on('error', (error) => {
                    console.log('Error processing video', error);
                    callback(error);    // call the callback with the error
                })
                .run();
        })
    } 