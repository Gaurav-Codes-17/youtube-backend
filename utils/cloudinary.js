import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";
import { ApiError } from "./ApiError.js";
import { userModel } from "../models/user.model.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath , resourceType) => {
  try {
    if (!localFilePath) return null;
    let respone = await cloudinary.uploader.upload(
      localFilePath,
      {resource_type : resourceType}
    );

    fs.unlinkSync(localFilePath, { resource_type: resourceType });
    return respone;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath , {resource_type : resourceType});
    throw new ApiError(
      500,
      "file has not been uploaded to cloudiary : ",
      error
    );
  }
};


const getPublicIdFromUrl = (url)=>{

  const imageArray = url.split("/")
  const imageName  = imageArray[imageArray.length-1]
  const imageId = imageName.split(".")[0]
return imageId
}


const deleteAssets = async(oldImagePath , resourceType) =>{

  try {
      
    const public_id =  getPublicIdFromUrl(oldImagePath)
    
    let result = await cloudinary.uploader.destroy(public_id, { resource_type: resourceType })
    
    return result

  } catch (error) {
    throw new ApiError(500 , "file is not deleted : " , error)
  }

}

export { uploadOnCloudinary  , deleteAssets};
