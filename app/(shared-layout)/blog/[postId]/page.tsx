import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/web/CommentSection";
import PostPresence from "@/components/web/PostPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";



interface PostIdRouteProps{
    params:Promise<{
        postId:Id<"posts">
    }>
}

export async function generateMetadata({params}:PostIdRouteProps):Promise<Metadata>{
    const {postId} = await params;
const post =      await fetchQuery(api.post.getPostById,{postId:postId});
if(!post){
    return{
        title:"post not found"
    }
}
return {
    title:post.title,
    description:post.content
}
}


export default async function PostIdPage({params}:PostIdRouteProps){
    const {postId}= await params;
const token = await getToken()

const [post,preloadedComments,userId] = await Promise.all([

      await fetchQuery(api.post.getPostById,{postId:postId}),


     await preloadQuery(api.comments.getCommentsByPostId,{postId:postId}),
    await fetchQuery(api.presence.getUserId,{},{token})

]);

if (!userId){
    return redirect('/auth/login')
}


    if (!post){
        return(
            <div>
                <h1 className="font-6xl font-extrabold text-red-500 py-20">No Post Found</h1>
            </div>
        )
        
    }
    return (
     <div className=" min-h-screen max-w-3xl mx-auto py-12 px-4 animate-in fade-in duration-500 relative">
        <Link href='/blog' className={buttonVariants({})}>
        <ArrowLeft className="size-4"/>
        Back to Blog
        </Link>

        <div className="mt-6 relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
           <Image src={post.imageUrl ?? 'https://images.unsplash.com/photo-1761839259488-2bdeeae794f5?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`'} alt={post.title} fill className="rounded-t-md object-cover hover:scale-105 duration-500 transition-transform"/>

        </div>

        <div className="space-y-5 flex flex-col">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground ">{post.title}</h1>
           <div className="flex items-center gap-2">
             <p className="text-sm text-muted-foreground">posted On: {new Date(post._creationTime).toLocaleDateString("en-US")}</p>
            {
                userId &&  <PostPresence roomId={post._id} userId={userId}/>
            }
           </div>
        </div>

<Separator className="my-4"/>
        <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap ">{post.content}</p>
      
<Separator className="my-8"/>
  <CommentSection preloadedComments={preloadedComments}/>

     </div>
    )
}
