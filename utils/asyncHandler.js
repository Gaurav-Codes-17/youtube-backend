
import {ApiError} from "./ApiError.js"
const asyncHandler = (requestHandler) => async (req,res,next) => {

    try {
        await requestHandler(req,res,next)
      
    } catch (error) {
        if (error.code < 100 || error.code > 500) {
            throw new ApiError(500 , "invalid code :" , error.message)
        }
        res
        .status(error.code)
        .json({
            success : false,
            message : error.message 
        })
    }
}

export {asyncHandler}