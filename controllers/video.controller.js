import mongoose, { isValidObjectId } from "mongoose";
import { videoModel } from "../models/video.model.js";
import { userModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if (!title || !description) {
    throw new ApiError(400, "title and description is required");
  }

  const videoLocalPath = await req.files.videoFile[0]?.path;
  const thumbnailLocalPath = await req.files.thumbnail[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "video and thumbnail is required");
  }

  const video = await uploadOnCloudinary(videoLocalPath, "video");
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "image");
  if (!video && !thumbnail) {
    throw new ApiError(400, "video and thumbnail is not uploaded");
  }

  const owner = await userModel
    .findById(req.user._id)
    .select(
      "-password -email -accessToken -refreshToken -createdAt -updatedAt -__v -username -coverImage -watchHistory"
    );

    const user = await userModel.findById(req.user._id);
  


  const videoFile = await videoModel.create({
    title: title,
    description: description,
    videoFile: video.url,
    thumbnail: thumbnail.url,
    duration: video.duration,
    owner,
    views : 0,
  });

    console.log(user.watchHistory);
    const watchedVid = user.watchHistory;
    let views = 0;

    await user.save({
      validateBeforeSave: false,})
    watchedVid.forEach((element) => {
      if (watchedVid.length === 0) {
        return;
      }
      if (element === videoFile._id) {
        views++;
      }
    });
    videoFile.views = views;
    await videoFile.save()
    
    const publishedVid = await videoModel.findById(videoFile._id)

    if (!videoFile) {
    throw new ApiError(400, "video is not created");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, publishedVid, "video is created"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
