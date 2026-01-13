
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import { Metadata } from "next"

import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Tech Blogs",
  description: "Tech related blogs from all over the world",
};

export const dynamic = 'force-static'
export const revalidate = false

export default function BlogPage() {
   
   
  return (
    <div className="h-screen py-12">
        <div className="text-center pb-12">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Blog Posts</h1>
            <p className="text-xl text-muted-foreground pt-3 max-w-2xl mx-auto">Read the latest articles from our community</p>

        </div>
        <Suspense fallback={
          <SkeletonLoading/>
        }>
<LoadBlogList/>
        </Suspense>
       
    </div>
  )
}


async function LoadBlogList(){
    const data = await fetchQuery(api.post.getPosts)
    return (
 <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4">
            {
                data?.map((post) => (
                   <Card key={post._id} className="pt-0">
                    <div className="relative h-60 w-full">
                        <Image src={post.imageUrl ?? 'https://images.unsplash.com/photo-1761839259488-2bdeeae794f5?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`'} alt="Blog Post Image" fill className="rounded-t-md object-cover"/>
                    </div>
                    <CardContent>
                        <Link href={`/blog/${post._id}`}>
                          <h1 className=" text-2xl font-bold hover:text-primary">  {post.title}</h1>
                        </Link>
                        <p className="text-muted-foreground line-clamp-3">{post.content}</p>

                    </CardContent>
                    <CardFooter>
                        <Link href={`/blog/${post._id}`} className={buttonVariants({
                            className:"w-full",
                        })}>Read More</Link>
                    </CardFooter>

                   </Card>
                ))
            }
        </div>
    )
}


function SkeletonLoading() {
    return (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4">
                {
                    [...Array(4)].map((_,i)=> <div className="flex flex-col space-y-3" key={i}>
                        <Skeleton className="h-50 w-full rounded-xl"/>
                        <div className="space-y-2 flex flex-col">
                            <Skeleton className="h-6 w-3/4 "/>
                            <Skeleton className="h-4 w-full"/>
                            <Skeleton className="h-4 w-2/3 "/>

                        </div>

                    </div>)
                }

            </div>
    )
    
}