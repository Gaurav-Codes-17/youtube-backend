import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { userModel } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs"

const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshToken = async (userId) => {
  const user = await userModel.findById(userId);
  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  // Check for empty fields
   if (
     [fullname, email, username, password].some((field) => field?.trim() === "")
   ) {
     throw new ApiError(400, "All fields are required");
   }

  // Check if password is less than 8 characters
  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters!");
  }

  // Check if user with same username or email already exists
  const existingUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(
      400,
      "User with the same username or email already exists"
    );
  }

  //uploading file on avatar and coverImage
try {
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  let avatar = await uploadOnCloudinary(avatarLocalPath);
  if (avatar) {
    fs.unlinkSync(avatarLocalPath);
  }

  let coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (coverImage) {
    fs.unlinkSync(coverImageLocalPath);
  }

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar");
  }

  console.log("Avatar URL:", avatar.url);
  console.log("Cover Image URL:", coverImage?.url);

  // Create new user
  const newUser = await userModel.create({
    email,
    username: username.toLowerCase(),
    fullname,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await userModel.findById(newUser._id).select("-password");

  if (!createdUser) {
    throw new ApiError(400, "User creation failed");
  }

  // Generate tokens and set cookies
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    newUser._id
  );
  const registeredUser = await userModel
    .findById(newUser._id)
    .select("-password -refreshToken");

  

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: registeredUser, accessToken, refreshToken },
        "User registered successfully"
      )
    );
} catch (error) {
  console.error("Error during user creation process:", error);
  throw new ApiError(500, "Internal server error");
}

});

export { registerUser }
