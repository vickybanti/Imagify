"use client"
import { useSession } from 'next-auth/react'
 
 const {data:session} = useSession()

export const userId = session?.user?.id
