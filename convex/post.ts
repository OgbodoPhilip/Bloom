import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";

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