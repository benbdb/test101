import Ffmpeg from "fluent-ffmpeg";
import path from "path";
import { __dirname } from "../utils.js";

export const transcodeVideo = async (videoPath, videoId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const outputPath = path.join(__dirname, `/tmp/transcoded/${videoId}.mp4`);
      Ffmpeg(videoPath)
        .output(outputPath)
        .videoCodec("mpeg4")
        .on("start", (commandLine) => {
          console.log("FFmpeg command: " + commandLine);
        })
        .on("progress", (progress) => {
          console.log(`Processing: ${progress.percent}% done`);
        })
        .on("end", () => {
          console.log("Transcoding finished successfully");
          resolve(outputPath);
        })
        .on("error", (err) => {
          console.error("Error during transcoding:", err.message);
          reject(err);
        })
        .run();
    } catch (err) {
      reject(err);
    }
  });
};
