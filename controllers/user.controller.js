import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { userModel } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secured: true,
};

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
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
    let coverImageLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
    ) {
      coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar is required");
    }

    let avatar = await uploadOnCloudinary(avatarLocalPath);

    let coverImage = await uploadOnCloudinary(coverImageLocalPath);

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
      coverImage: coverImage.url,
    });

    const createdUser = await userModel
      .findById(newUser._id)
      .select("-password -refreshToken");

    if (!createdUser) {
      throw new ApiError(400, "User creation failed");
    }

    // Generate tokens and set cookies
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      createdUser._id
    );
    const registeredUser = await userModel
      .findById(createdUser._id)
      .select("-password  -refreshToken  ");

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: registeredUser },
          "User registered successfully"
        )
      );
  } catch (error) {
    console.error("Error during user creation process:", error);
    throw new ApiError(500, "Internal server error");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  if (!(email || username)) {
    throw new ApiError(400, "username or email are required");
  }
  let user = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw new ApiError(400, "there is no account with this email or username");
  }

  const userPassword = await user.isPasswordCorrect(password);
  if (!userPassword) {
    throw new ApiError(400, "password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  const loggedInUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new ApiError(400, "unauthorized request");
  }
  const decodedToken = jwt.verify(token, process.env.JWT_REFRESHTOKEN_SECRET);

  const user = await userModel.findById(decodedToken._id);
  if (decodedToken !== user?.refreshToken) {
    throw new ApiError(400, "invalid refresh token");
  }
  const { refreshToken, accessToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "tokens are refreshed"
      )
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, confirmPassword, newPassword } = req.body;

  if (!(oldPassword || newPassword || confirmPassword)) {
    throw new ApiError(401, "all feilds are required");
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, "password must be of 8 characters");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "password does not match!!");
  }

  const user = await userModel.findById(req.user._id);

  if (!user) {
    throw new ApiError(500, "user not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "password is not correct");
  }

  user.password = newPassword
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200 , user , "password changed successfully" ));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
};
