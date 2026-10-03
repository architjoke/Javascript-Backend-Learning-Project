import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try{
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "")
    if(!token){
        throw new ApiError(401, "Unauthorized")
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken.id).select("-password -refreshToken")
    if(!user){
        throw new ApiError(401, "Invalid Access token")
    }
    req.user = user
    next()
    }catch (err){
        throw new ApiError(401, "Unauthorized", err?.message || "Invalid Access token")
    }
})