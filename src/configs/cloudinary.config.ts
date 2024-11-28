import { v2 as cloudinary } from "cloudinary"

import { config } from "dotenv"
config()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your Cloudinary API secret
  secure: true // Ensures that the connection to Cloudinary is secure
})

export default cloudinary
