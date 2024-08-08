import mongoose, {isValidObjectId} from "mongoose"
import {userModel} from "../models/user.model.js"
import {videoModel} from "../models/video.model.js"
import { subscriptionModel } from "../models/subscription.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if (channelId && !isValidObjectId) {
        throw new ApiError(400 , "channel id is not valid")
    }
    
    const user = await userModel.findById(req.user._id).select("-password -watchHistory -createdAt -updatedAt -email -__v")

    if (!user) {
        throw new ApiError(400 , "user not found")
    }

    const channel = await userModel.findById(channelId).select("-password -watchHistory -createdAt -updatedAt -email -__v")

    if (!channel) {
        throw new ApiError(400 , "channel not found")
    }

    const subscription = await subscriptionModel.findOne({
        subscriber : user,
        channel : channel
    })

        if (subscription) {
            await subscriptionModel.findByIdAndDelete(subscription._id)
            return res
            .status(200)
            .json(new ApiResponse(200, null, { message: "unsubscribed" }));
        } else {
                await subscriptionModel.create({
                subscriber : user,
                channel : channel
            })

            return res
            .status(200)
            .json(new ApiResponse(200, null, { message: "subscribed " }));

        }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if (channelId && !isValidObjectId(channelId)) {
        throw new ApiError(400, "invalid channel id")
    }

        const channel = await userModel
        .findById(channelId)
        .select("-password -watchHistory -createdAt -updatedAt -email")

        if (!channel) {
            throw new ApiError(400 , "channel not found")
        }

            const subscribers = await subscriptionModel
            .find({ channel: channel })
            .populate("subscriber", "fullname username")
            .populate("channel", "fullname username")
            .select("-_id -createdAt -updatedAt -__v")

        if (!subscribers) {
            throw new ApiError(400 , "subscriber not found")
        }

        if (subscribers.length <= 0) {
            return res 
            .status(200)
            .json(new ApiResponse(
                200,
                " no subscriber found"
            ))
        }

            return res 
            .status(200)
            .json(new ApiResponse(
                200,
                subscribers,
                " subscribers fetched successfully..."
            ))


})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (subscriberId && !isValidObjectId(subscriberId)) {
        throw new ApiError(400 , "subscriber id is not valid")
    }

    const subscriber = await userModel.findById(subscriberId)

    if (!subscriber) {
        throw new ApiError(400 , "user not found")
    }

    const SubscribedTo = await subscriptionModel
      .find({ subscriber })
      .populate("subscriber", "fullname username")
      .populate("channel", "fullname username")
      .select("-password -createdAt -updatedAt -__v ");

    if (!SubscribedTo) {
        throw new ApiError(400 , "no channels found")
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            SubscribedTo,
            "your subscribed channel fetched successfully...."
        )
    )




})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}