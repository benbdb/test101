import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({ region: "ap-southeast-2" });

export const createPresignedUploadURL = async (user, id) => {
  const Bucket = process.env.BUCKET_NAME;
  const Key = `${user}/uploaded/${id}`;
  const Fields = {
    acl: "bucket-owner-full-control",
  };
  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket,
    Key,
    Fields,
    Expires: 600,
  });
  return {
    url,
    fields,
  };
};

export const createPresignedDownloadURL = async (user, videoId) => {
  const input = {
    Bucket: "a2-pair91",
    Key: `${user}/transcoded/${videoId}`,
  };
  const command = new GetObjectCommand(input);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 600 });
  return url;
};
