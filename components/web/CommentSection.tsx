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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";

export default function CommentSection() {
     const params = useParams<{ postId: Id<"posts"> }>();
    const data = useQuery(api.comments.getCommentsByPostId,{postId:params.postId})
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">5 comments</h2>
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

        <section className="space-y-6">
            {
                data?.map((comment)=>(
                    <div key={comment._id} className="flex gap-4">

                    </div>

                ))
            }

        </section>
       
      </CardContent>
    </Card>
  );
}
