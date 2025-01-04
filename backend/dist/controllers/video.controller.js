"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideoController = void 0;
const video_service_1 = require("../services/video.service");
const fs_1 = __importDefault(require("fs"));
const uploadVideoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(400).json({
            success: false,
            message: "No file uploaded",
        });
        return;
    }
    const videoPath = req.file.path; // Path to uploaded video
    const outputPath = `output/${Date.now()}`; // Unique output directory
    (0, video_service_1.processVideoForHls)(videoPath, outputPath, (error, masterPlaylist) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: "An error occurred while processing the video",
            });
            return;
        }
        // Delete the original video file after processing
        try {
            fs_1.default.unlinkSync(videoPath);
        }
        catch (unlinkError) {
            console.error("Error deleting original video file:", unlinkError);
        }
        // Respond with success and master playlist
        res.status(200).json({
            success: true,
            message: "Video processed successfully",
            data: `/${masterPlaylist}`,
        });
    });
});
exports.uploadVideoController = uploadVideoController;
