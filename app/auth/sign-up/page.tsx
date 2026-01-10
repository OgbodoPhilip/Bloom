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

export default function SignUpPage() {
    const form = useForm({
        resolver:zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }

    })

   async function onSubmit(data:z.infer<typeof signUpSchema>){
    await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
    })
       
    }
  return (
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
               <Button type='submit' className='mt-6'> Sign Up</Button>
            </FieldGroup>

        </form>
    </CardContent>
   </Card>
  )
}