export async function POST (request: Request) {
    const {title,content} = await request.json();   
    console.log("Received blog creation request:", { title, content });

    // Here you would typically call your Convex mutation to create the blog post
    // For example:
    // const result = await createPostMutation({ title, body: content });
    return new Response(JSON.stringify({ message: "Blog post created successfully" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}