'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {useForm,Controller} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema } from '@/app/schemas/auth'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import z from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { start } from 'repl'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
      const [isPending,startTransition] = useTransition();
    const router = useRouter();
    const form = useForm({
        resolver:zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }

    })

   function onSubmit(data:z.infer<typeof signUpSchema>){
    startTransition(async ()=>{
         await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
         fetchOptions:{
                    onSuccess:()=>{
                       toast.success(" Accounted Created successfully😁")
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
    <section>
   <Card>
    <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
    </CardHeader>
    <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className='gap-y-2'>
                <Controller name='name' control={form.control} render={({field,fieldState})=>(
                    <Field>
                        <FieldLabel>
                           Full Name 
                        </FieldLabel>
                        <Input
                        aria-invalid={fieldState.invalid} 
                        placeholder="Enter your name" {...field}/>
                        {
                            fieldState.invalid && (<FieldError errors={[fieldState.error]}/>
                            )
                        }
                    </Field>
                )}/>
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
             <span>Creating Account...</span>
                
                </>
               ):(
                <span>Signup</span>
               )}</Button>
            </FieldGroup>

        </form>
        
    </CardContent>
   
   </Card>
    <div className='flex items-center justify-between'>
        <p>Have an account ?</p>
    <Link className='text-xl font-bold text-blue-500' href='/auth/login'>Login</Link>
    </div>
    </section>
  )
}