import mongoose, { isValidObjectId } from "mongoose";
import { videoModel } from "../models/video.model.js";
import { userModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteAssets, uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, q, sortBy, sortType, _id } = req.query;
  //TODO: get all videos based on query, sort, pagination

  


  let sortCriteria = {};
  if (sortBy) {
    sortCriteria[sortBy] = sortType === "desc" ? -1 : 1;
  }

  let searchCriteria = {isPublished : true};
  if (q) {
    let queryRegex = new RegExp(q, "i");

    searchCriteria = {
      $or: [{ title: queryRegex }, { description: queryRegex } 
      ],
    };
    sortCriteria[q];
  }
 if (_id) {
   if (!isValidObjectId(_id)) {
     throw new ApiError(400, "Invalid ID");
   }
   searchCriteria = { ...searchCriteria, owner: _id };
 }


  const allVideos = await videoModel
  .find(searchCriteria)
    .populate("owner")
    .select("-password -__v -createdAt -updatedAt  -email ")
    .sort(sortCriteria)
    .skip((page - 1) * limit)
    .limit(limit);

return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      { allVideos, videoLength: allVideos.length },
      "videos are found"
    )
  );

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
    isPublished: true,
    owner,
    views: 0,
  })

  const watchedVid = user.watchHistory;
  let views = 0;

  await user.save({
    validateBeforeSave: false,
  });
  watchedVid.forEach((element) => {
    if (watchedVid.length === 0) {
      return;
    }
    if (element === videoFile._id) {
      views++;
    }
  });
  videoFile.views = views;
  await videoFile.save();

  const publishedVid = await videoModel.findById(videoFile._id).populate("owner");

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
  if (videoId && !isValidObjectId(videoId)) {
    throw new ApiError(400, "id is not valid");
  }

  const video = await videoModel.findById(videoId).populate("owner");

  if (!video) {
    throw new ApiError(400, "video is not found");
  }

  return res.status(200).json(new ApiResponse(200, video, "video is found"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  if (videoId && !isValidObjectId(videoId)) {
    throw new ApiError(400, "id is not valid");
  }

  const video = await videoModel.findById(videoId);
  if (!video) {
    throw new ApiError(400, "video is not found");
  }
  const { title, description } = req.body;
  if ([title , description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "title and description is required");
  }

  let thumbnailLocalPath = req.file?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail is required");
  }

   

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "image");

  if (!thumbnail) {
    throw new ApiError(400, "thumbnail is not uploaded");
  }

    const oldThumbnailPath = video.thumbnail;
    await deleteAssets(oldThumbnailPath , "image");

    const updatedVideo = await videoModel.findOneAndUpdate(
    {
      _id : videoId
    },
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail.url,
      },
    },
    { new: true }
  ).populate("owner")
  

    
 




  return res
    .status(200)
    .json(new ApiResponse(200,
       updatedVideo, 
       "video is updated"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  if (videoId && !isValidObjectId(videoId)) {
    throw new ApiError(400, "id is not valid");
  }
  const video = await videoModel.findById(videoId);
  if (!video) {
    throw new ApiError(400, "video is not found");
  }

  const oldVideoPath = video.videoFile;

  await deleteAssets(oldVideoPath , "video");

    await videoModel.findOneAndDelete({
    _id: videoId,})

    
     return res.status(200).json(new ApiResponse(200, null, "video is deleted"));


});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle publish status
  if (videoId && !isValidObjectId(videoId)) {
    throw new ApiError(400, "id is not valid");
    
  } 
  const video = await videoModel.findById(videoId);
  if (!video) {
    throw new ApiError(400, "video is not found");  
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res.status(200).json(new ApiResponse(200, video, `"video is ${video.isPublished ? "published" : "unpublished"}`));


});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
