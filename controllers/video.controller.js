import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../chai-backend/src/models/video.model.js"
import {User} from "../chai-backend/src/models/user.model.js"
import {ApiError} from "../chai-backend/src/utils/ApiError.js"
import {ApiResponse} from "../chai-backend/src/utils/ApiResponse.js"
import {asyncHandler} from "../chai-backend/src/utils/asyncHandler.js"
import {uploadOnCloudinary} from "../chai-backend/src/utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
