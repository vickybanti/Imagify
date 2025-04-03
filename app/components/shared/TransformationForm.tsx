"use client"
import React, { useState, useTransition } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { aspectRatioOptions, defaultValues, transformationTypes } from '@/app/constants'
import { CustomField } from './CustomField'
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils'
import { config } from 'process'
import { updateCredits } from '@/lib/actions/user.actions'
import MediaUploader from './MediaUploaader'
import TransformedImage from './TransformedImage'
import { getCldImageUrl } from 'next-cloudinary'
import { useRouter } from 'next/navigation'
import { addImage, updateImage } from '@/lib/actions/image.actions'

 export const formSchema = z.object({
        title: z.string(),
        aspectRatio: z.string().optional(),
        color: z.string().optional(),
        prompt: z.string().optional(),
        publicId: z.string(),
        theme: z.string().optional()
      
      })


export const TransformationForm = ({action,config=null, data=null, userId, type, creditBalance}: TransformationFormProps) => {
  const transformationType = transformationTypes[type];

  const [image, setImage] = useState(data)
  const [isSubmitting, setSubmitting] = useState(false)
  const [isTransforming, setTransforming] = useState(false)
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)

  const [transformationConfig, setTransformationConfig] = useState(config)
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const onInputChangeHandler = (fieldName:string, 
    value:string, type:string, 
    onChangeField: (value: string) => void) => {
      debounce(() => {}, 1000);
      setNewTransformation((prevState:any)=>({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === 'prompt' ? 'prompt' : 'to'] : value
        }
      }))
      return onChangeField(value)
    
  }
  const initialValues = data && action === 'Update' ? {
        title:data?.title,
        aspectRatio:data?.aspectRatio,
        color:data?.color,
        prompt:data?.prompt,
        publicId:data.publicId
    }:defaultValues

  

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof formSchema>) {
       setSubmitting(true)

       if(data || image) {
        const transformationUrl = getCldImageUrl({
          width:image?.width,
          height : image?.height,
          src: image?.publicId,
          ...transformationConfig
        })

        const imageData = {
          title: values.title,
          publicId: image?.publicId,
          width:image?.width,
          height:image?.height,
          transformationType: type,
          config: transformationConfig,
          secureUrl: image?.secureUrl,
          aspectRatio: values?.aspectRatio,
          prompt: values.prompt,
          color:values.color,
          transformationURL:transformationUrl
        }
        if(action === 'Add') {
          try{
            const newImage = await addImage({
              image: imageData,
              userId,
              path:'/'
            })

            if(newImage) {
              form.reset()
              setImage(data)
              router.push(`/transformations/${newImage._id}`)
            }
          }catch(error){
            console.log(error)
          }
        }

         if(action === 'Update') {
                  try{
                    const updatedImage = await updateImage({
                      image: { 
                      ...imageData,
                      _id: data._id
                      },
                      userId,
                      path:`/transformations/${data._id}`
                    })
        
                    if(updatedImage) {
                      router.push(`/transformations/${updatedImage._id}`)
                    }
                  }catch(error){
                    console.log(error)
                  }
                }

                

       }
       setSubmitting(false)
          console.log(values)
        }

        const onSelectChangeField = (value:string, onChangeField:(value:string) =>void) =>{
          const imageSize = aspectRatioOptions[value as AspectRatioKey]
          setImage((prevState:any) => ({
            ...prevState,
            aspectRatio:imageSize.aspectRatio,
            width: imageSize.width,
            height: imageSize.height
          }))

          setNewTransformation(transformationType.config )
          return onChangeField(value)
          
        }

        const onTransformHandler = async() => {
          setTransforming(true)
          setTransformationConfig(
            deepMergeObjects(newTransformation,transformationConfig)
          )
          setTransformationConfig(null)
          startTransition(async () => {
            await updateCredits(userId, -1)
          })
        
        }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField 
          control={form.control}
          formLabel="image title"
          name="title"
          className="w-full"
          render={({field}) => <Input {...field} className="input-field"/>}

        />

        {type === 'fill' && (
          <CustomField 
          control={form.control}
          name="aspectRatio"
          formLabel="Aspect Ratio"
          className="w-full"
          render={({field}) => (
            <Select 
            onValueChange = {(value) => onSelectChangeField(value, field.onChange)}
            >
            <SelectTrigger className="select-field">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              
                {Object.keys(aspectRatioOptions).map((key) => (
                  <SelectItem key={key} value={key} className="select-item">
                    {aspectRatioOptions[key as AspectRatioKey].label}
                  </SelectItem>
                ))}
              
            </SelectContent>
          </Select>
          )}
          />
        )}

        {(type === 'remove'|| type === 'recolor') && (
          <div className="prompt-field">
              <CustomField 
                control={form.control}
                name="prompt"
                formLabel={
                  type ==='remove' ? 'Object to remove' : 'Object to recolor'
                }
                className='w-full'
                render={({field}) => <Input {...field} 
                value={field.value} 
                onChange={(e) => {onInputChangeHandler('prompt', 
                  e.target.value,
                type,
              field.onChange)}}
                className="input-field" />}
              />

              {type === 'recolor' && (
                <CustomField
                control={form.control}

                name="color"
                formLabel="New color"
                className="w-full"
                render={({field}) => <Input {...field}
                value={field.value}
                onChange={(e) => {onInputChangeHandler('color',
                e.target.value,
                type,
                field.onChange)}
                }
                className="input-field"
                />}
                />
              )}

          </div>  
        )
        }

        <div className="media-uploader-field">
          <CustomField
          control={form.control}  
          name="publicId"
          className='flex size-full flec-col'
          render={({field}) => (
            
            <MediaUploader
            image={image}
            onValueChange={field.onChange}
            setImage={setImage}
            publicId={field.value}
            type={type}

        
            />
          )}
          />  
            
          <TransformedImage
          image={image}
          type={type}
          title={form.getValues().title}
          isTransforming={isTransforming}
          transformationConfig={transformationConfig}
          setIsTransforming={setTransforming}
          />
          
          
        </div>
      <div className='flex flex-col gap-4'>
        <Button type="submit" 
                className='submit-button capitalize'
                disabled={isTransforming || newTransformation === null}
                onClick={onTransformHandler}>
                  {isTransforming ? 'Transforming...':'Apply Transformation'}
                </Button>
      

        <Button type="submit" 
        className='submit-button capitalize'
        disabled={isSubmitting}>{isSubmitting? 'Submitting...':'Save image'}</Button>
        </div>
      </form>
    </Form>
  )
}

export default TransformationForm