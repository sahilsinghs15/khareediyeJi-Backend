import app from "./app.js";
import { configDotenv } from "dotenv";
configDotenv();
import {v2} from "cloudinary";
import connectionToDb from "./config/db.config.js";

// Cloudinary configuration
v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = 5000;
app.listen(PORT , async ()=>{
    await connectionToDb();
    console.log(`Server is running at ${PORT}`);
})