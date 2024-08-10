import mongoose from "mongoose";
import { videoModel } from "../models/video.model.js";
import { subscriptionModel } from "../models/subscription.model.js";
import { likeModel } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const loggedInUserVideo = await videoModel.find({ owner: (req.user._id)}).populate("owner")

  if (!loggedInUserVideo) {
    throw new ApiError(400 ,  "video not found")
  }

  const totalSubscribers = await subscriptionModel
    .find({ channel: (req.user._id) })
    .count();
  let totalVideos = loggedInUserVideo.length;
  let totalViews = 0;
  loggedInUserVideo.forEach((video) => {
    totalViews += video.views
  })

  let totalLikes = await likeModel
    .find({ likedBy: (req.user._id) })
    .count();

  return res.status(200).json(new ApiResponse(200,{ totalVideos , totalSubscribers , totalLikes , totalViews}, "stats are fetched successfully"))
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const userVideos = await videoModel.find({owner : req.user._id}).populate("owner")
  if (userVideos.length <= 0) {
    return res.status(200).json(new ApiResponse(200  , "this channel has no videos"))
  }
  return res.status(200).json(new ApiResponse(200 , userVideos , "all videos are fetched successfully")) 
});


export { getChannelStats, getChannelVideos };
