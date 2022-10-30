import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const bucketAccessKey = process.env.BUCKET_ACCESS_KEY as string;
const bucketSecretKey = process.env.BUCKET_SECRET_KEY as string;
console.log({ bucketRegion, bucketName });
export const s3 = new S3Client({
  credentials: {
    accessKeyId: bucketAccessKey,
    secretAccessKey: bucketSecretKey,
  },
  region: bucketRegion,
});
