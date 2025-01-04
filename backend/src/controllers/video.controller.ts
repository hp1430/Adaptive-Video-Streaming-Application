import { Request, Response } from "express";
import { processVideoForHls } from "../services/video.service";
import fs from "fs";

export const uploadVideoController = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
    return;
  }

  const videoPath = req.file.path; // Path to uploaded video
  const outputPath = `output/${Date.now()}`; // Unique output directory

  processVideoForHls(videoPath, outputPath, (error, masterPlaylist) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while processing the video",
      });
      return;
    }

    // Delete the original video file after processing
    try {
      fs.unlinkSync(videoPath);
    } catch (unlinkError) {
      console.error("Error deleting original video file:", unlinkError);
    }

    // Respond with success and master playlist
    res.status(200).json({
      success: true,
      message: "Video processed successfully",
      data: `/${masterPlaylist}`,
    });
  });
};
