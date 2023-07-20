import React, { useEffect } from 'react'
import socket from '@/configs/socketConfig'

export default function Home() {

  useEffect(() => {
    socket.on('test', (msg) => {
      console.log(msg)
    })
  }, [])

  return (
    <main>
      <p className="text-3xl font-bold tracking-wider text-neutral-700">Petatype</p>
      <div>
        <button>Practice</button>
        <button>Solo</button>
        <button>Create New Lobby</button>
        <button>Join Lobby</button>
      </div>
    </main>
  )
}
