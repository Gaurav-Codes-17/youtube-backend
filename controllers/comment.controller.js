import mongoose, { isValidObjectId } from "mongoose"
import {commentModel} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {videoModel} from "../models/video.model.js"
import { userModel } from "../models/user.model.js"
import { json } from "express"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10 } = req.query

    if (videoId && !isValidObjectId(videoId)) {
        throw new ApiError(400 , "video id is not valid")
    }

    const video = await videoModel.findById(videoId)

    const comments = await commentModel
    .find({video})
    .populate("owner" , "-password -watchHistory -__v -email -coverImage -refreshToken -accessToken")
    .skip((page - 1) * limit)
    .limit(limit)

    if (!comments) {
        throw new ApiError(400 , "comments has not been found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comments,
            "comments has been fetched...."
        )
    )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body

    if (videoId && !isValidObjectId(videoId)) {
        throw new ApiError(404 , "video id is not valid")
    }

    const video = await videoModel.findById(videoId).populate("owner")
    if (!video) {
        throw new ApiError(404 , "video not found")
    }

    if (!content) {
        throw new ApiError(400 , "comment field cannot be empty!")
    }
    const commentOwner = await userModel.findById(req.user._id).select("-password -email -__v -accessToken -refreshToken -watchHistory -createdAt -updatedAt")

    const comment = await commentModel.create({
        content,
        video : video,
        owner : commentOwner
    })
    if (!comment) {
        throw new ApiError(400 , "comment has not been uploaded")
    }

    return res
    .status(200)
    .json(
       new ApiResponse(
        200,
        comment,
        "your comment has been added successfully!!"
       )
    )


})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content} = req.body
    const {commentId} = req.params

    if (commentId && !isValidObjectId(commentId)) {
        throw new ApiError(400 , "comment id is not valid")
    }

    const comment = await commentModel.findByIdAndUpdate(commentId , {content} , {new : true}).populate("owner" , "-password -watchHistory -__v -coverImage -avatar -refreshToken")

    if (!comment) {
        throw new ApiError(400 , "comment has not been updated")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comment,
            "comment has been updated"
        )
    )

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
        const { commentId } = req.params;

        if (commentId && !isValidObjectId(commentId)) {
        throw new ApiError(400, "comment id is not valid");
        }

        const comment = await commentModel
        .findByIdAndDelete(commentId)
        if (!comment) {
        throw new ApiError(400, "comment has not been deleted");
        }

        return res
        .status(200)
        .json(new ApiResponse(200, null, "comment has been deleted successfully !!"));

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
