import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = mongoose.Schema(
  {
    username: String,
    fullname: String,
    email: String,
    avatar: { type: String},
    coverImage: { type: String, default: "" },
    refreshToken: String,
    password: {
      type: String,
      require: true,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "video",
      },
    ],
  },
  { timestamps: true }
);


userSchema.pre("save" , async function(next){
  if(!this.isModified) return next();
  this.password = await bcrypt.hash(this.password , 10)
  next();
})

userSchema.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password ,  this.password)

}


userSchema.methods.generateRefreshToken = function(){
 return jwt.sign(
   { email: this.email, username: this.username },
   process.env.JWT_REFRESHTOKEN_SECRETE,
   {
     expiresIn: "1d",
   }
 );
}

userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { email: this.email  , username : this.username},
    process.env.JWT_ACCESSTOKEN_SECRETE,
    { expiresIn: "5d" }
  );
}


const userModel =  mongoose.model("user" , userSchema)





export {userModel}
