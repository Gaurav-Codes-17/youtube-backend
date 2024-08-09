import mongoose, { isValidObjectId } from "mongoose";
import { playlistModel } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userModel } from "../models/user.model.js";
import { videoModel } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const user = await userModel
    .findById(req.user._id)
    .select(
      "-password -watchHistory -__v -accessToken -refreshToken -email -coverImage"
    );
  if (!user) {
    throw new ApiError(400, "user not found");
  }

  const playlist = await playlistModel.create({
    name,
    description,
    owner: user,
  });

  if (!playlist) {
    throw new ApiError(400, "playlist is not created");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist created successfully !!"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists

  if (userId && !isValidObjectId(userId)) {
    throw new ApiError(400, "user id is not valid");
  }

  const userPlaylist = await playlistModel
    .find({ owner: userId })
    .populate(
      "owner",
      "-password -watchHistory -__v -accessToken -refreshToken -email -coverImage"
    );
  if (!userPlaylist) {
    throw new ApiError(400, "playlist not found");
  }

  if (userPlaylist.length <= 0) {
    return res.status(200).json(
      new ApiResponse(
        200,

        "user have no playlist"
      )
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylist, "playlist fetched successfully....")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (playlistId && !isValidObjectId(playlistId)) {
    throw new ApiError(400, "invalid playlist");
  }

  const playlist = await playlistModel.findById(playlistId);
  if (!playlist) {
    throw new ApiError(400, "playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "this channel has 0 playlist"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (playlistId && !isValidObjectId(playlistId)) {
        throw new ApiError(400, "playlist is not valid");
    }
    if (videoId && !isValidObjectId(videoId)) {
        throw new ApiError(400, "video is not valid");
    }

    const playlist = await playlistModel.findById(playlistId).populate("owner")

    if (!playlist) {
        throw new ApiError(400 , "playlist not find")
    }

    

    const video = await videoModel.findById(videoId) 
    if (!video) {
        throw new ApiError(400 , "video not found")
    }
    
    playlist.videos.push(video);
    await playlist.save({ validateBeforeSave: false });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , 
            playlist,
            "video added into playlist"
        )
    )

});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
    if (playlistId && !isValidObjectId(playlistId)) {
        throw new ApiError(400, "playlist is not valid");
    }
    if (videoId && !isValidObjectId(videoId)) {
        throw new ApiError(400, "video is not valid");
        }

        const playlist = await playlistModel.findById(playlistId)
        if (!playlist) {
            throw new ApiError(400,  "playlist not found")
        }
        const video = await videoModel.findById(videoId)
        if (!video) {
            throw new ApiError(400 , "video not found")
        }

        const index = playlist.videos.indexOf(video._id)
        playlist.videos.splice(index , 1)
        await playlist.save({validateBeforeSave : false})
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "video is removed from the"

            )
        )

});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
  // TODO: delete playlist

    if (playlistId && !isValidObjectId(playlistId)) {
        throw new ApiError(400, "playlist is not valid");
    }
    const playlist = await playlistModel.findByIdAndDelete(playlistId)
    if (!playlist) {
        throw new ApiError(400 , "playlist not deleted")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            null, 
            "playlist deleted successfully"
        )
    )
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist

    if (playlistId && !isValidObjectId(playlistId)) {
        throw new ApiError(400, "playlist is not valid");
    }

    const playlist = await playlistModel.findByIdAndUpdate(playlistId , {$set : {name , description}} , {new : true});
    if (!playlist) {
        throw new ApiError(400, "playlist not updated");
    }

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            playlist,
            "playlist updated successfully"
        )
        );


});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
