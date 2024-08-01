import {ApiError} from "../chai-backend/src/utils/ApiError.js"
import {ApiResponse} from "../chai-backend/src/utils/ApiResponse.js"
import {asyncHandler} from "../chai-backend/src/utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
})

export {
    healthcheck
    }
    