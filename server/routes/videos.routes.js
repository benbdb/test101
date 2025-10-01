import { Router } from "express";
import { checkAuth } from "../middleware/auth.js";
import {
  createPresignedDownloadURL,
  createPresignedUploadURL,
  uploadVideoToS3,
} from "../lib/s3.js";
import { v4 as uuidv4 } from "uuid";
import { upload } from "../lib/multer.js";
import {
  addVideoToTable,
  checkUserHasVideos,
  getVideoList,
} from "../lib/dynamodb.js";
import { transcodeVideo } from "../lib/ffmpeg.js";
import { downloadFromPresignedUrlAxios } from "../utils.js";
import { unlink } from "fs/promises";
import path from "path";
import { __dirname } from "../utils.js";

const router = Router();

router.post("/upload-video", checkAuth, upload.none(), async (req, res) => {
  const exists = await checkUserHasVideos(req.user.username);
  if (exists && req.user.userGroups[0] === "free") res.status(423);
  console.log(exists);
  const id = uuidv4();
  const filename = req.body.filename;
  await addVideoToTable(req.user.username, id, filename);
  const presignedPost = await createPresignedUploadURL(req.user.username, id);
  res.json(presignedPost).status(200);
});

router.post("/transcode", checkAuth, upload.none(), async (req, res) => {
  console.log(req.body);
  const videoId = req.body["videoId"];
  console.log(videoId);

  const presignedURL = await createPresignedDownloadURL(
    req.user.username,
    videoId,
    false
  );
  const uploadedPath = await downloadFromPresignedUrlAxios(
    presignedURL,
    videoId
  );
  const transcodedPath = await transcodeVideo(uploadedPath, videoId);

  await uploadVideoToS3(req.user.username, videoId);

  unlink(path.join(__dirname, `/tmp/uploads/${videoId}`));
  unlink(path.join(__dirname, `/tmp/transcoded/${videoId}.mp4`));
  const presignedDownloadURL = await createPresignedDownloadURL(
    req.user.username,
    videoId,
    true
  );
  res.json(presignedDownloadURL).status(200);
});

router.get("/list-videos", checkAuth, async (req, res) => {
  const items = await getVideoList(req.user.username);
  res.json(items).status(200);
});

export default router;
