import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    let respone = await cloudinary.uploader.upload(localFilePath);

    console.log("the file has been uploaded its url is : ", respone.url);
    fs.unlinkSync(localFilePath);
    return respone;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw new ApiError(
      500,
      "file has not been uploaded to cloudiary : ",
      error
    );
  }
};

export { uploadOnCloudinary };
