'use client'
import { loginSchema } from '@/app/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import {useForm,Controller} from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import z from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { stat } from 'fs'
import { Loader2 } from 'lucide-react'


export default function LoginPage() {
    const [isPending,startTransition] = useTransition();
    const router = useRouter();
     const form = useForm({
            resolver:zodResolver(loginSchema),
            defaultValues: {
                
                email: '',
                password: ''
            }
    
        })

          function onSubmit(data:z.infer<typeof loginSchema>){

            startTransition(async ()=>{
                 await authClient.signIn.email({
               
                email: data.email,
                password: data.password,
                fetchOptions:{
                    onSuccess:()=>{
                       toast.success("Logged in successfully")
                          router.push("/")
                    },
                    onError: (error)=>{
                        toast.error(`Error logging in: ${error.error.message}`)
                    }
                }
            })


            })
           
               
            }
  return (
    <Card>
    <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Log into your account</CardDescription>
    </CardHeader>
    <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className='gap-y-2'>
                
                <Controller name='email' control={form.control} render={({field,fieldState})=>(
                    <Field>
                        <FieldLabel>
                          Email
                        </FieldLabel>
                        <Input
                          aria-invalid={fieldState.invalid}  
                        placeholder="Enter your email" type='email' {...field}/>
                        {
                            fieldState.invalid && (<FieldError errors={[fieldState.error]}/>
                            )
                        }
                    </Field>
                )}/>
                <Controller name='password' control={form.control} render={({field,fieldState})=>(
                    <Field>
                        <FieldLabel>
                          Password
                        </FieldLabel>
                        <Input
                          aria-invalid={fieldState.invalid} 
                        placeholder="Enter your password" type='password' {...field}/>
                        {
                            fieldState.invalid && (<FieldError errors={[fieldState.error]}/>
                            )
                        }
                    </Field>
                )}/>
               <Button disabled={isPending} className='mt-6'> {isPending?(
                <>
                <Loader2 className='size-4 animate-spin'/>
             <span>   Logging in...</span>
                
                </>
               ):(
                <span>Login</span>
               )}</Button>
            </FieldGroup>

        </form>
    </CardContent>
   </Card>
  )
}