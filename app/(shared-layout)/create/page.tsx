"use client";
import { createBlogAction } from "@/app/actions";
import { postSchema } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { start } from "repl";
import { toast } from "sonner";
import z from "zod";

export default function CreatePage() {
    const generateUploadUrl = useMutation(api.post.generateImageUploadUrl);
const createPost = useMutation(api.post.createPost);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const mutation = useMutation(api.post.createPost);
  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      image: undefined,
    },
  });

//   function onSubmit(values: z.infer<typeof postSchema>) {
//     startTransition(async () => {
//       await mutation({
//           title: values.title,
//           body: values.content
//       });
//       toast.success("Post created successfully!");

//       router.push("/");

//     //   await createBlogAction(values);
//       toast.success("Post created successfully!");
//       router.push("/");
//     });
//   }

// 2. Updated onSubmit
function onSubmit(values: z.infer<typeof postSchema>) {
  startTransition(async () => {
    try {
      let storageId = undefined;

      // STEP 1: Upload the image directly from the browser to Convex
      // This bypasses the 1MB Next.js Server Action limit
      if (values.image instanceof File) {
        const uploadUrl = await generateUploadUrl();

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": values.image.type },
          body: values.image, // The browser sends this directly to Convex
        });

        if (!result.ok) throw new Error("Upload failed");
        
        const json = await result.json();
        storageId = json.storageId; // Note: Use lowercase 'storageId' to match Convex response
      }

      // STEP 2: Save the post data and the ID to the database
      await createPost({
        title: values.title,
        body: values.content,
        imageStorageId: storageId,
      });

      toast.success("Post created successfully!");
      router.push("/blog");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post. Image might be too large.");
    }
  });
}
  return (
    <div className="py-8 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Create Post
        </h1>
        <p className="text-xl text-muted-foreground pt-3">
          Share your thought with the whole world!
        </p>
      </div>

      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create Blog Article</CardTitle>
          <CardDescription>Create a anew blog article</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your blog title"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your blog content"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Image</FieldLabel>
                    <Input
                      type="file"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your blog content"
                    accept="images/*"
                    onChange={(event)=>{const file = event.target.files?.[0]

                         field.onChange(file)
                    }}
                   
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button disabled={isPending} className="mt-6">
                {" "}
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Creating post...</span>
                  </>
                ) : (
                  <span>Create Post</span>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
