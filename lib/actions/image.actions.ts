"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../utils/connect"
import { handleError } from "../utils"
import Image from "../database/models/image.model"
import User from "../database/models/user.model"
import { redirect } from "next/navigation"


const populateUser = (query:any) => 
    query.populate({
        path:'author',
        model: User,
        select:'_id firstName lastName'
    })



//ADD IMAGE
export async function addImage({image, userId, path}: AddImageParams) {
    try{
        await connectToDatabase()

        const author = await User.findById(userId)

        if (!author) {
            throw new Error("User not found")
        }

        const newImage = await Image.create({
            ...image, author:author._id
        })
        revalidatePath(path)
        return JSON.parse(JSON.stringify(newImage))
    } catch(error){
        handleError(error)
    }
}

//GET IMAGE

export async function getImageById(imageId: string) {
    try{
        await connectToDatabase()
        //get both images and image author
        const image = await populateUser(Image.findById(imageId))
        if (!image) throw new Error("No image found")
        
        return JSON.parse(JSON.stringify(image))
    } catch(error){
        handleError(error)
    }
}

export async function updateImage({image, userId, path}: UpdateImageParams) {
    try{
        await connectToDatabase()

        const imageToUpdate = await Image.findById(image._id)
        
        if(!imageToUpdate || imageToUpdate.author.toHexString() !== userId) {
            throw new Error("Unathorized or image not found")

        }

        const updatedImage = await Image.findByIdAndUpdate(
            imageToUpdate._id,
            image,
            {new:true}
        )
        revalidatePath(path)
        return JSON.parse(JSON.stringify(updatedImage))
    } catch(error){
        handleError(error)
    }
}

export async function deleteImage(imageId: string) {
    try{
        await connectToDatabase()
        await Image.findByIdAndDelete(imageId)
        redirect('/')
    } catch(error){
        handleError(error)
    }
}