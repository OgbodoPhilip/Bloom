
'use server';


import { postSchema } from './schemas/blog';
import { fetchMutation } from 'convex/nextjs';
import z from 'zod';
import { redirect } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { getToken } from '@/lib/auth-server';
import { revalidatePath, updateTag } from 'next/cache';




export async function createBlogAction(values:z.infer<typeof postSchema>) {
  
   try {
     const parsed= postSchema.safeParse(values);
   if(!parsed.success){
     throw new Error("something went wrong");
   }
   const token = await getToken();
    const imageUrl = await fetchMutation(api.post.generateImageUploadUrl,{},{token})
    const uploadResult =  await fetch(imageUrl,{
        method:'POST',
        headers:{
            "content-Type":parsed.data.image.type
        },
        body:parsed.data.image
    })
    if(!uploadResult){
        return {
            error:'Failed to upload image'
        }
    }
    const {StorageId} = await uploadResult.json();
     await fetchMutation(api.post.createPost,{
        body:parsed.data.content,
        title:parsed.data.title,
        imageStorageId:StorageId
    },{token}) 
    

   } catch {
    return{
        error:'Failed to create post'
   }
   }
   

updateTag('blog')
   return redirect('/blog');

}