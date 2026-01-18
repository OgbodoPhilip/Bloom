import { Loader2, Search } from 'lucide-react'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Props = {}

export default function SearchInput({}: Props) {
    const [term,setTerm] = useState('');
    const [open, setOpen] = useState(false)

    const results = useQuery(
        api.post.searchPosts,term.length >= 2 ? {limit:5, term:term} : "skip"
       
    )
    function handleInputChange(e:React.ChangeEvent<HTMLInputElement>){
        setTerm(e.target.value)
        setOpen(true)

    }
  return (
   <div className="relative w-full max-w-sm z-10">
    <div className="relative">
        <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground'/>
        <Input type='search' placeholder='Search posts...' className='w-full pl-8 bg-background ' value={term} onChange={handleInputChange}/>
    </div>
    {
        open && term.length >= 2 && (
            <div className="absolute  mt-2 p-2 rounded-md border shadow-md outline-none animate-in fade-in-0 zoom-in-95 ">

                {
                    results === undefined ? (
                        <div className='flex items-center justify-center p-4 text-sm text-muted-foreground'>
                            <Loader2 className='mr-2 size-4 animate-spin'/>
                            Searching...
                        </div>
                    ):results.length === 0 ? (
                        <p className='p-4 text-sm text-muted-foreground text-center'>No result found</p>
                    ):(
                        <div className='py-1 '>
                            {
                                results.map((post)=>(
                                    <Link className='flex flex-col px-4 py2' href={`/blog/${post._id}`} key={post._id}
                                    onClick={()=>{
                                        setOpen(false)
                                        setTerm('')
                                    }}
                                    >
                                        <motion.p whileTap={{scale:0.9}} className='font-medium truncate text-blue-500'>{post.title}</motion.p>
                                    
                                    </Link>
                                ))
                            }

                        </div>
                    )
                }


            </div>
        )
    }
   </div>
  )
}