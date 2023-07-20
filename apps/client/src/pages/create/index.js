import React, { useState, useEffect } from 'react'

import socket from '@/configs/socketConfig'


export default function Create() {

    const [lobbyName, setLobbyName] = useState('')

    const handleCreateNewLobby = async () => {

        socket.on('connect', () => {
            console.log("dfafdfsd")
            console.log(socket.id)
            socket.emit('create-lobby', socket.id)
        })
    }


    return (
        <main className="h-screen flex flex-col justify-center items-center gap-10">
            <div>
                <p className="text-4xl font-mono">Create a new lobby</p>
            </div>
            <div className="flex flex-row justify-center items-center gap-4">
                <input type="text" placeholder="Lobby name" />
                <button onClick={handleCreateNewLobby}>Create</button>
            </div>
        </main>
    )
}