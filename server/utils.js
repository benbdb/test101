import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
import axios from "axios";
import { createWriteStream, mkdir } from "fs";

export const downloadFromPresignedUrlAxios = async (presignedUrl, filename) => {
  await mkdir("/tmp/uploads", (err) => {
    console.log(err);
  });

  const outputPath = path.join(__dirname, "/tmp/uploads", filename);

  const response = await axios({
    method: "GET",
    url: presignedUrl,
    responseType: "stream",
  });

  const writer = createWriteStream(outputPath);

  const totalSize = parseInt(response.headers["content-length"], 10);
  let downloadedSize = 0;

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      console.log("Download completed successfully");
      resolve(outputPath);
    });
    writer.on("error", reject);
  });
};
