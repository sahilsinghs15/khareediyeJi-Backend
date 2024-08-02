import User from "../models/user.model.js";
import asynhandler from "express-async-handler";
import appError from "../utils/appError.js";
import crypto from "crypto";
import fs from "fs/promises";

const cookieOptions = {
  secure: process.env.NODE_ENV === 'production' ? true : false,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
};


export const registerUser = asynhandler( async(req , res , next)=>{
    const {fullName , email , password} = req.body;

    if(!(fullName || email || password )){
        return next(new appError("FullName , Email and Password Are Required" , 403));
    }

    const user = await User.create({
        fullName : fullName,
        email : email,
        password : password,
        avatar : {
            public_id : email,
            secure_url : 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
        }
    });

    if(!user){
        return next(new appError("User not created some error occurred") , 403);
    }

    if(req.file){
        try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms', // Save files in a folder named lms
        width: 250,
        height: 250,
        gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
        crop: 'fill',
      });

      // If success
      if (result) {
        // Set the public_id and secure_url in DB
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // After successful upload remove the file from local storage
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new appError(error || 'File not uploaded, please try again', 400)
      );
    }
    }

    await user.save();

    const token = await user.generateJWTToken();
    
    //Setting it undefined because password does not get sent in the response
    user.password = undefined;

    res.cookie('token' , token , cookieOptions);

    res.status(201).json({
        success : true,
        message : "User Created succesfully",
        user,
    })
})
