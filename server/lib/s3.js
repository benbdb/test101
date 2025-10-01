import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createReadStream } from "fs";
import { __dirname } from "../utils.js";
import path from "path";

export const s3Client = new S3Client({ region: "ap-southeast-2" });

export const createPresignedUploadURL = async (user, id) => {
  const Bucket = process.env.BUCKET_NAME;
  const Key = `${user}/uploaded/${id}`;
  console.log(Key);
  const Fields = {
    acl: "bucket-owner-full-control",
  };
  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket,
    Key,
    Fields,
    Expires: 6000,
  });
  return {
    url,
    fields,
  };
};

export const createPresignedDownloadURL = async (user, videoId, transcoded) => {
  const input = {
    Bucket: "a2-pair91",
    Key: `${user}/${transcoded ? "transcoded" : "uploaded"}/${videoId}${
      transcoded ? ".mp4" : ""
    }`,
  };
  const command = new GetObjectCommand(input);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 600 });
  return url;
};

export const uploadVideoToS3 = async (userid, videoid) => {
  try {
    const filePath = path.join(__dirname, "/tmp/transcoded", videoid + ".mp4");
    const fileStream = createReadStream(filePath);

    const objectKey = `${userid}/transcoded/${videoid}.mp4`;

    const response = await s3Client.send(
      new PutObjectCommand({
        Bucket: "a2-pair91",
        Key: objectKey,
        Body: fileStream,
        ContentType: "video/mp4",
      })
    );

    console.log("Upload successful:", response);
    return response;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
