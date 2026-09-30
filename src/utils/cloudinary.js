import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = async (filePathr) => {
    try{
        if(!filePAthr) return null
        //upload file to cloudinary
        const response = await cloudinary.uploader.upload(filePathr, {
            resource_type: "auto"
        })
        console.log("File uploaded to cloudinary successfully",reponse.url)
        return response
    } catch(err){
        fs.unlinkSync(filePathr) //delete the file from local storage
        return null
    }
}
export {uploadToCloudinary}