import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = async (filePath) => {
    try{
        if(!filePath) return null
        //upload file to cloudinary
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(filePath) //delete the file from local storage
        return response
    } catch(error){
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath) //delete the file from local storage
        }
        throw error
    }
}
export {uploadToCloudinary}