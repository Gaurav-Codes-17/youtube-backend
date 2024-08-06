import mongoose, { isValidObjectId } from "mongoose"
import {tweetModel} from "../models/tweet.model.js"
import {userModel} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body

    if (!content) {
        throw new ApiError(400, "content is required")
    }

    const user = await userModel.findById(req.user._id).select("-password -email -accessToken -refreshToken -__v  -watchHistory")
    if (!user) {
        throw new ApiError(404, "user not found")    
    }

    const date = Date.now()


    const tweet = await tweetModel.create({
        content,
        owner: user,

    })

    if (!tweet) {
        throw new ApiError(400, "tweet is not created")
    }

        return res
        .status(200)
        .json(new ApiResponse(
            200, 
            tweet,
            "tweet is created"
        ))

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params

    if (userId && !isValidObjectId(userId)) {
        throw new ApiError(400, "invalid user id")
    }

    const tweet = await tweetModel.find({owner: userId}).populate("owner")
    if (!tweet) {
        throw new ApiError(404 , "tweets not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweet,
            "tweets found"
        )
    )

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
 const {content} = req.body

 if (tweetId && !isValidObjectId(tweetId)) {
    throw new ApiError(400, "tweet id is not valid")
 }

const tweet = await tweetModel.findByIdAndUpdate(tweetId, {content}, {new: true})
 if (!tweet) {
    throw new ApiError(404, "tweet not found")
 }

 return res
 .status(200)
 .json(
     new ApiResponse(
         200,
         tweet,
         "tweet is updated"
     )
 )

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    if (tweetId && !isValidObjectId(tweetId)) {
        throw new ApiError(400, "tweet id is not valid");
        }

        const tweet = await tweetModel.findByIdAndDelete(tweetId)
        if (!tweet) {
            new ApiError(400 , "tweet is not found")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "tweet is deleted"
            )
        )

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
