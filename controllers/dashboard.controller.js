import mongoose from "mongoose";
import { Video } from "../chai-backend/src/models/video.model.js";
import { Subscription } from "../chai-backend/src/models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../chai-backend/src/utils/ApiError.js";
import { ApiResponse } from "../chai-backend/src/utils/ApiResponse.js";
import { asyncHandler } from "../chai-backend/src/utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
});

export { getChannelStats, getChannelVideos };
