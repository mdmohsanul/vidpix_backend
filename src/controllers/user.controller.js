import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser = asyncHandler(async (req,res) => {
  // get the user details
  // validation - not empty
  // check if the user is already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary
  // create user object
  // remove password and refresh token field from response
  // check for user creation
  // save the details to database
})

export {registerUser}