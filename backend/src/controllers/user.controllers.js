import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, username, mobileNumber } = req.body;

  // console.log("name", fullName, "email", email);

  if (!fullName || !email || !username || !mobileNumber || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const exitedUser = await User.findOne({
    $or: [{ username }, { email }, { mobileNumber }],
  });

  if (exitedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    mobileNumber,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error creating user");
  }

  // Generate tokens
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: createdUser,
      },
      "Successfully created user!"
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {
  // console.log("Body: ", req.body);

  const { email, username, password } = req.body;

  if (!(email || username) || !password) {
    throw new ApiError(400, "Please provide email/Username and password");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "Use not found");
  }

  const isPasswordValid = await user.isCorrectPassword(password);

  // console.log("Is correct password:", isPasswordValid);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect Password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        accessToken,
        refreshToken,
        user,
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // console.log("req.user:", req.user); // Debugging log

  if (!req.user || !req.user._id) {
    throw new ApiError(400, "User not authenticated");
  }

  await User.findOneAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
        accessToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { email, fullName, mobileNumber } = req.body;

  if (!fullName || !email || !email) {
    throw new ApiError(400, "please enter fullName, email, mobileNumber");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
        mobileNumber,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details update sucessfully!"));
});

const passwordChange = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isCorrectPassword = await user.isCorrectPassword(oldPassword);

  if (!isCorrectPassword) {
    throw new ApiError(400, "Invaild Old Password");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed sucessfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id

  if (!userId) {
    throw new ApiError(400, "User not authenticated")
  }

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "User deleted sucessfully!"
      )
    )

})



export {
  generateAccessTokenAndRefreshToken,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
  passwordChange,
  deleteUser,
};



// const updateUserProfile = asyncHandler(async (req, res) => {
//   const { email, fullName, mobileNumber } = req.body;

//   if (!email && !fullName && !mobileNumber) {
//     throw new ApiError(400, "Please provide at least one field to update");
//   }

//   const updateFields = {};
//   if (email) updateFields.email = email;
//   if (fullName) updateFields.fullName = fullName;
//   if (mobileNumber) updateFields.mobileNumber = mobileNumber;

//   const user = await User.findByIdAndUpdate(
//     req.user?._id,
//     { $set: updateFields },
//     { new: true }
//   ).select("-password");

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, user, "Account details updated successfully!"));
// });

// const getCurrentUser = asyncHandler(async (req, res) => {
//   const user = await User
//     .findById(req.user._id)
//     .select("-password -refreshToken");

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   return res
//     .status(200)
//     .json(
//       new ApiResponse
//         (200,
//           user,
//           "User fetched successfully"));
// });
