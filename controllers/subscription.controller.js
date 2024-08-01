import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../chai-backend/src/models/user.model.js"
import { Subscription } from "../chai-backend/src/models/subscription.model.js"
import {ApiError} from "../chai-backend/src/utils/ApiError.js"
import {ApiResponse} from "../chai-backend/src/utils/ApiResponse.js"
import {asyncHandler} from "../chai-backend/src/utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}