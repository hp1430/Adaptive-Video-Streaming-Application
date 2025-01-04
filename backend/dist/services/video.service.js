"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processVideoForHls = void 0;
const fs_1 = __importDefault(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const resolutions = [
    { width: 1920, height: 1080, bitRate: 2000 }, // 1080p
    { width: 1280, height: 720, bitRate: 1000 }, // 720p
    { width: 854, height: 480, bitRate: 500 }, // 480p
    { width: 640, height: 360, bitRate: 400 }, // 360p
];
const processVideoForHls = (inputPath, outputPath, callback) => {
    fs_1.default.mkdirSync(outputPath, { recursive: true }); // create output directory
    const masterPlaylist = `${outputPath}/master.m3u8`; // master playlist path
    const masterContent = []; // master playlist content
    let countProcessing = 0;
    resolutions.forEach((resolution) => {
        const variantOutput = `${outputPath}/${resolution.height}p`; // variant output path
        const variantPlaylist = `${variantOutput}/playlist.m3u8`; // variant playlist path
        fs_1.default.mkdirSync(variantOutput, { recursive: true }); // create variant output directory
        (0, fluent_ffmpeg_1.default)(inputPath)
            .outputOptions([
            `-vf scale=w=${resolution.width}:h=${resolution.height}`,
            `-b:v ${resolution.bitRate}k`,
            `-codec:v libx264`,
            `-codec:a aac`,
            `-hls_time 10`,
            `-hls_playlist_type vod`,
            `-hls_segment_filename ${variantOutput}/segment%03d.ts`
        ])
            .output(variantPlaylist) // output to the variant playlist file
            .on('end', () => {
            // when the processing ends, add the variant playlist to the master playlist
            masterContent.push(`
                        #EXT-X-STREAM-INF: BANDWIDTH=${resolution.bitRate * 1000}, 
                        RESOLUTION=${resolution.width}x${resolution.height}\n
                        ${resolution.height}p/playlist.m3u8`);
            countProcessing += 1;
            if (countProcessing === resolutions.length) {
                console.log('All resolutions processed');
                console.log(masterContent);
                // when all resolutions are processed, write the master playlist
                fs_1.default.writeFileSync(masterPlaylist, `#EXTM3U\n${masterContent.join('\n')}`); // write the master playlist
                callback(null, masterPlaylist); // call the callback with the master playlist path
            }
        })
            .on('error', (error) => {
            console.log('Error processing video', error);
            callback(error, masterPlaylist); // call the callback with the error
        })
            .run();
    });
};
exports.processVideoForHls = processVideoForHls;
