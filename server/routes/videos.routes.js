import { Router } from "express";
import { checkAuth } from "../middleware/auth.js";
import {
  createPresignedDownloadURL,
  createPresignedUploadURL,
} from "../lib/s3.js";
import { v4 as uuidv4 } from "uuid";
import { upload } from "../lib/multer.js";

const router = Router();

router.get("/upload-video", checkAuth, upload.none(), async (req, res) => {
  const id = uuidv4();
  const presignedPost = await createPresignedUploadURL(req.user.username);
  res.json(presignedPost).status(200);
});

router.get("/download-video", checkAuth, upload.none(), async (req, res) => {
  const id = req.body.videoId;
  console.log(id);
  const presignedGet = await createPresignedDownloadURL(req.user.username, id);
  res.json(presignedGet).status(200);
});

router.get("/list-videos", checkAuth, async (req, res) => {});

export default router;
