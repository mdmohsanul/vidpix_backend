import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get the user details
  // validation - not empty
  // check if the user is already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary
  // create user object
  // remove password and refresh token field from response
  // check for user creation
  // save the details to database

  const { username, fullname, email, password } = req.body;
  console.log(email);
  if (
    [fullname, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "ALl fields are required");
  }

  // $ give access to many operator like and , or, etc
  const existeduser = await User.find({
    $or: [{ username }, { email }],
  });
  if (existeduser) {
    throw new ApiError(409, "User already exists");
  }

  // multer give this access
  // first upload images on server, multer middleware helps to save it in server
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload file on cloudinary and it return a url string

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // entry on database
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowercase(),
  });
  // check if the user details is save in db or not.
  // if save then we have to send to frontend by removing the password and access token field

  // select will use to remove fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

export {registerUser}