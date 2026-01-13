"use client";
import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comments";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, useMutation, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

export default function CommentSection(props:{
    preloadedComments:Preloaded<typeof api.comments.getCommentsByPostId>
}) {
     const params = useParams<{ postId: Id<"posts"> }>();
    const data = usePreloadedQuery(props.preloadedComments)
  const [isPending, startTransition] = useTransition();
 
  const createComment = useMutation(api.comments.createComment);
  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
      postId: params.postId,
    },
  });

  async function onSubmit(data: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      try {
        await createComment(data);
         form.reset({ content: "", postId: params.postId });
        toast.success("Comment posted");
       
      } catch (error) {
        toast.error("Failed to create post");
      }
    });
  }

  if(data === undefined){
    return <p>Loading...</p>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">{data.length} comments</h2>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Comments</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Leave a comment"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className="flex justify-end my-3">
 <Button disabled={isPending} className="">
            {" "}
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>submitting...</span>
              </>
            ) : (
              <span>Submit</span>
            )}
          </Button>
          </div>
         
        </form>

        {data?.length > 0 && <Separator className="my-4"/>}

        <section className="space-y-6">
            {
                data?.map((comment)=>(
                    <div key={comment._id} className="flex gap-4 items-center ">
                        <Avatar className="size-8 shrink-0">
                            <AvatarImage 
                            src={`https://avatar.vercel.sh/${comment.authorName}`}
                            alt={comment.authorName}/>
                            <AvatarFallback>
                                {comment.authorName.slice(0,2).toUpperCase()}
                            </AvatarFallback>

                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between"> 
                                <p className="font-semibold text-sm">{comment.authorName}</p>
                                <p className="text-muted-foreground text-xs">{new Date(comment._creationTime).toLocaleDateString("en-US")}</p>

                            </div>
                            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{comment.content}</p>





                        </div>




                    </div>

                ))
            }

        </section>
       
      </CardContent>
    </Card>
  );
}
