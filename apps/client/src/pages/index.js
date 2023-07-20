import React, { useEffect } from 'react'
import socket from '@/configs/socketConfig'
import Link from 'next/link'
import { v4 as uuid } from 'uuid';

export default function Home() {
  const userID = uuid();

  useEffect(() => {
    socket.on('test', 'fdasfsdfa')
    //If no uid in local storage
    if(!localStorage.getItem('PetaTypeUiD')) {
      localStorage.setItem('PetaTypeUiD', userID)
    }
  }, [])

  return (
    <main className='h-screen flex flex-col justify-center items-center gap-10'>
      <p className="text-5xl">PetaType</p>
      <div className='flex flex-row gap-4'>
        <button><Link href="practice">Practice</Link></button>
        <button><Link href="solo">Solo</Link></button>
        <button><Link href="create">New Lobby</Link></button>
        <button><Link href="join">Join Lobby</Link></button>
      </div>
    </main>
  )
}
