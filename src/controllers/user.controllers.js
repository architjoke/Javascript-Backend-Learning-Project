import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
const registerUser = asyncHandler(async (req, res) => {
  // Extract user data from the request body
  const { fullname, username, email, password } = req.body
  //console.log("email :", email)
  // Validate required fields
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }
  // Check if the user already exists in the database
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  })
  if (existedUser) {
    throw new ApiError(409, "User already exists")
  }
  // Upload avatar and cover image to Cloudinary
  const avatarlocalPath = req.files?.avatar?.[0]?.path
  //const coverImageLocalPath = req.files?.coverImage?.[0]?.path
  let coverImageLocalPath
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
  }

  if (!avatarlocalPath) {
    throw new ApiError(400, "Avatar file is required")
  }
  const avatar = await uploadToCloudinary(avatarlocalPath, "avatar")
  const coverImage = await uploadToCloudinary(
    coverImageLocalPath,
    "coverImage"
  )
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required")
  }
  // Create a new user in the database
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
    email,
    password,
  })
  // Fetch the created user without sensitive fields
  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  // Return a success response with the created user data
  if(!createdUser){
    throw new ApiError(500, "User creation failed")
  }
  // Return a success response with the created user data
  return res.status(201).json(
    new ApiResponse(201, "User created successfully", createdUser)
  )
})
export { registerUser }
