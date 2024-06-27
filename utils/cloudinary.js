

import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: "gauravcodes",
  api_key: "699786734522564",
  api_secret: "lCd-R5fLWDWVtwcnwUbks3Y9GHY",
});




 const uploadOnCloudinary = async(localFilePath)=>{
  try {
    if (!localFilePath) return null
    let respone = await cloudinary.uploader.upload(localFilePath)
    
    console.log("the file has been uploaded its url is : " , respone.url);
    fs.unlinkSync(localFilePath)
    return respone
  } catch (error) {
    await fs.unlinkSync(localFilePath)
    throw new ApiError(500 , "file has not been uploaded to cloudiary : " , error)
  }

 }


export { uploadOnCloudinary };
