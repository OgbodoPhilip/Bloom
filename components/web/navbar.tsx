"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SearchInput from "./SearchInput";


const links = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Create", href: "/create" },
]

export default function Navbar() {
    const {isAuthenticated,isLoading} = useConvexAuth();
    const router = useRouter();
  return (
    <nav className="sticky w-full y-5 flex items-center justify-between px-8 py-3  backdrop-blur-md top-0 z-50 ">
      <motion.div
        className="flex items-center gap-8"
        whileTap={{ scale: 0.95 }} // Shrinks when clicked
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Link href="/">
          <h1 className="text-3xl font-bold">
            Next <span className="text-blue-500 ">Pro</span>
          </h1>
        </Link>

       
      </motion.div>


    <div className="  flex items-center justify-center space-x-10 ">
         {
         links.map((link) => (
            <motion.div className="flex items-center gap-2 " key={link.name}  whileTap={{ scale: 0.95 }} // Shrinks when clicked
        transition={{ type: "spring", stiffness: 300, damping: 10}}>
          <Link href={link.href} className="hover:text-blue-500 transition font-bold text-xl">
           {link.name}
          </Link>
         
        </motion.div>
         ))
     }

    </div>

      <div className="flex items-center gap-2 ">
        <div className="hidden md:block mr-2">
          <SearchInput/>
        </div>
        {
            isLoading ? null : isAuthenticated ? (
               <Button onClick={()=>authClient.signOut({
                fetchOptions:{
                    onSuccess:()=>{
                        toast.success("Logged out successfully")
                        router.push("/")
                    },
                    onError: (error)=>{
                        toast.error(`Error logging out: ${error.error.message}`)
                    }
                }
                
               })}> Logout</Button>
            ) : (
               <>
               <Link className={buttonVariants()} href="/auth/sign-up">Sign Up </Link>
      <Link className={buttonVariants({variant:'secondary'})} href="/auth/login">Login </Link>
               </>
            )
        }
     
      <ThemeToggle/>
      </div>
    </nav>
  );
}
