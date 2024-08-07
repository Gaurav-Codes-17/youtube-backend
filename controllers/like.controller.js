import mongoose, { isValidObjectId } from "mongoose";
import { likeModel } from "../models/like.model.js";
import { videoModel } from "../models/video.model.js";
import {userModel} from "../models/user.model.js"
import { commentModel } from "../models/comment.model.js";
import { tweetModel } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  if (videoId &&!isValidObjectId(videoId)) {
    throw new ApiError(400 , "invalid video id")
  }

  const video = await videoModel.findById(videoId);
  if (!video) {
    throw new ApiError(400, "video is not found");
  }
  const user = await userModel.findById(req.user._id)
  if (!user) {
    throw new ApiError(400, "user not found")
  }
  const like = await likeModel.findOne({
    video: videoId,
    likedBy: user,
  });
  if (like) {
    await likeModel.findByIdAndDelete(like._id);

    return res.status(200).json(new ApiResponse(200, null, "unliked"))
  } else {
    const likedVideo = await likeModel.create({
      video: video,
      likedBy: user,
    });

    return res.status(200).json(new ApiResponse(200, likedVideo, "liked"))

  }






});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  //checking if the id is valid or not

  if (commentId && !isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid comment id");
    }

    //getting comment which is being liked 
  const commentbyUser = await commentModel.findById(commentId);

//getting user who liked the comment
    const user = await userModel.findById(req.user._id)
    if (!user) {
      throw new ApiError(400 , "user not found")
    }

    //finding if already the comment is liked 
    const comment = await likeModel.findOne
    ({
      comment : commentId, 
      likedBy : user
    })

    //writing toggle logic for liking and unliking the video

    if (comment) {
      await likeModel.findByIdAndDelete(comment._id)
      return res.status(200).json(new ApiResponse(200, null, "unliked"));
    }else{
      await likeModel.create({
        comment : commentbyUser,
        likedBy : user
      })
      return res.status(200).json(new ApiResponse(200 , null , "liked"));

    }

});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  //checking if tweet id is valid or not
  if (tweetId && !isValidObjectId(tweetId)) {
    throw new ApiError(400 ,"tweet id is not valid")
  }

  const tweet = await tweetModel.findById(tweetId)

  if (!tweet) {
    throw new ApiError(400 , "tweet is not found")
  }

  const user = await userModel.findById(req.user._id)

  if (!user) {
    throw new ApiError(400, "user not found")
  }

  const likedTweet = await likeModel.findOne(
    {
      tweet : tweetId,
      likedBy : user
    }
  )

  if (likedTweet) {
    await likeModel.findByIdAndDelete(likedTweet._id)
    res.status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "unliked"
      )
    )
  }else{
    const tweetLikedByTheUser = await likeModel.create({
      tweet : tweet,
      likedBy : user
    })

    if (!tweetLikedByTheUser) {
      throw new ApiError(400 , "tweet is not liked")
    }

    return res.status(200)
    .json(
      new ApiResponse(200 , tweetLikedByTheUser , "liked")
    )
  }




});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  
  const user = await userModel.findById(req.user._id)

  if (!user) {
    throw new ApiError(400, "user not found")
  }

  const likedVideos = await likeModel
    .find({ likedBy: user, video: { $exists: true } })
    .populate("video");
  

  return res 
  .status(200)
  .json(
    new ApiResponse(
      200,
      likedVideos,
      "liked videos fetched successfully...."
    )
  )

});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
