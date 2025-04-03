"use client";
import React from 'react'
import { toast } from "sonner"
import {CldImage, CldUploadWidget} from 'next-cloudinary'
import Image from 'next/image';
import { dataUrl, getImageSize } from '@/lib/utils';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import { Widgets } from '@mui/icons-material';

type MediaImageProps = {
    onValueChange: (value: string) => void; 
    setImage: React.Dispatch<any>;
    publicId: string;
    type: string;
    image: any;
}

const MediaUploader = ({
    onValueChange,
    setImage,
    publicId,
    type,
    image,

}:MediaImageProps) => {
    const onUplaodSuccess = (result:any) => {
        
    setImage((prevState:any) => ({
        ...prevState,
        publicId: result?.info?.secure_url,
        width: result?.info?.width,
        height: result?.info?.height,
        secureUrl: result?.info?.secure_url,
    }))
    onValueChange(result?.info?.public_id)
    toast(result?.info?.message, {
        description: 'Upload Successful',
        className: 'success-toast',
        duration: 5000,
    })
    }

    const onUploadError = (error:any) => {
        toast.error(error.message, {
            description: 'Upload Error',
            className: 'error-toast',
            duration: 5000,
        })
    }
    return (
        <CldUploadWidget
        uploadPreset={"Banti_Imaginify"}
        options={{
            multiple: false,
            resourceType: 'image',
        }}
        onSuccess={onUplaodSuccess}
        onError={onUploadError}
        >  
        {({open}) =>(
            <div className="flex flex-col gap-4">
                <h3 className="text-dark-600 h3-bold">Original</h3>
                {publicId ? (
                    <>
                    <div className='cursor-pointer overflow-hidden rounded-[10px]'>
                        <CldImage 
                        src={publicId}
                        width={getImageSize(type, image, "width")}
                        height={getImageSize(type, image, "height")}
                        alt='image'
                        sizes={'(max-width: 768px) 100vw, 50vw'}
                        placeholder={dataUrl as PlaceholderValue}
                        className="media-uploader_cldImage"
                        />

                    </div>
                    </>
                )
                :
                (
                    <div className='media-uploader_cta' onClick={()=>open()}>
                        <div className="media-uploader_cta-image">
                            <Image 
                             width={24}
                             height={24}
                             src="/assets/icons/add.svg" alt="upload" />
                        </div>
                        <p className="text-dark-600">Upload Image</p>
                </div>
                )
                
            }
            </div>
        )}
        
        </CldUploadWidget>
    )
}
export default MediaUploader
