import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";
import { Doc } from "./_generated/dataModel";

// 1. Create Post (Fixed the v.optional validation)
export const createPost = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    imageStorageId: v.optional(v.id("_storage")), // Validation fix here
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const blogArticle = await ctx.db.insert("posts", {
      title: args.title,
      content: args.body,
      authorId: user._id,
      imageStorageId: args.imageStorageId,
    });

    return blogArticle;
  },
});

// 2. Get Posts (Enhanced to include actual Image URLs)
export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();

    // Map through posts to turn storageIds into downloadable URLs
    return await Promise.all(
        posts.map(async(post)=>{
            const resolveImageUrl = post.imageStorageId !== undefined ? await ctx.storage.getUrl(post.imageStorageId):null
            return {
                ...post,imageUrl:resolveImageUrl,
            }
        })
    )
  },
});

// 3. Generate Upload URL
export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});




export const getPostById = query({
    args:{
        postId:v.id("posts") 

    },
    handler:async (ctx,args)=>{
        const post = await ctx.db.get(args.postId)
        if(!post){
            return null;
        }
        const resolvedImageUrl = post?.imageStorageId !== undefined ? await ctx.storage.getUrl(post.imageStorageId):null

        return {
            ...post,
            imageUrl:resolvedImageUrl
        }
    }
})


interface searchResultTypes{
  _id:string;
  title:string;
  content:string
}


export const searchPosts = query({
  args:{
    term:v.string(),
    limit:v.number()
  },
  handler:async (ctx,args) => {
    const limit = args.limit;
    const results:Array<searchResultTypes> = [];
    const seen = new Set();
    const pushDocs = async(docs:Array<Doc<'posts'>>) => {
     for( const doc of docs){
      if(seen.has(doc._id))continue;
      seen.add(doc._id);
      results.push({
        _id:doc._id,
        title:doc.title,
        content:doc.content
      })
      if(results.length >= limit) break;
     } 
    }

    const titleMatches = await ctx.db.query('posts').withSearchIndex('search_title',(q)=>q.search('title',args.term)).take(limit)

    await pushDocs(titleMatches)

    if(results.length < limit){
      const bodyMatches = await ctx.db.query('posts').withSearchIndex('search_content',(q)=>q.search('content',args.term)).take(limit)

    await pushDocs(bodyMatches)
    }
    return results;
  }
})