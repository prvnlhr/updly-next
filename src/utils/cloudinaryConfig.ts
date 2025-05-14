"use server";
import { v2 as cloudinary } from "cloudinary";
import type {
  UploadApiOptions,
  UploadApiResponse,
  DeleteApiResponse,
} from "cloudinary";
// import { loadManifestWithRetries } from "next/dist/server/load-components";

const {
  NEXT_CLOUDINARY_CLOUD_NAME,
  NEXT_CLOUDINARY_API_KEY,
  NEXT_CLOUDINARY_API_SECRET,
} = process.env;

// Validate environment variables to prevent runtime errors
if (
  !NEXT_CLOUDINARY_CLOUD_NAME ||
  !NEXT_CLOUDINARY_API_KEY ||
  !NEXT_CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary environment variables are not defined");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: NEXT_CLOUDINARY_CLOUD_NAME,
  api_key: NEXT_CLOUDINARY_API_KEY,
  api_secret: NEXT_CLOUDINARY_API_SECRET,
  secure: true,
});

// Define upload options with proper typing
const uploadOptions: UploadApiOptions = {
  resource_type: "auto",
  folder: "/updly/assets",
  format: "png",
};

// Upload function with typed parameters and return value
export const uploadToCloudinary = async (
  file: File
): Promise<UploadApiResponse> => {
  try {
    const fileArrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileArrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: unknown, result?: UploadApiResponse) => {
          if (error || !result) {
            return reject(error || new Error("Upload failed"));
          }
          resolve(result);
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    throw new Error(
      `Failed to upload file to Cloudinary: ${(error as Error).message}`
    );
  }
};

// Delete function with typed parameters and return value
export const deleteImage = async (
  cloudinaryId: string
): Promise<DeleteApiResponse> => {
  try {
    const result = await cloudinary.uploader.destroy(cloudinaryId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error(`Failed to delete image: ${(error as Error).message}`);
  }
};
