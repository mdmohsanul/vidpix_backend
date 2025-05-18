import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const UserSchema = new mongoose.Schema({
    watchHistory : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }],
    username :{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email :{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname :{
        type:String,
        required:true,
        trim:true,
    },
    avatar:{
        type:String, // cloudinary url
      required:true
    },
    coverImage: {
        type:String, // cloudinary url
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    refreshToken:{
        type:String
    }
},
{timestamps:true}
)
// pre is hook provided by mongoose
// this function will execute in two scenarios register or change password
UserSchema.pre("save", async function (next) {

    if(!this.isModified("password")) next()
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

// method to check if the password is correct or not
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// method to generate access token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.fullname,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// method to generate refresh token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User",UserSchema)
