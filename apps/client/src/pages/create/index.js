import React, { useState, useEffect } from 'react'

import socket from '@/configs/socketConfig'

export default function Create() {
    const [lobbyId, setLobbyId] = useState('')

    const handleCreateNewLobby = async () => {
        socket.on('connect', () => {
            console.log({ playerId: socket.id })
        })
        socket.emit('create-lobby', lobbyId)
    }


    return (
        <main className="h-screen flex flex-col justify-center items-center gap-10">
            <div>
                <p className="text-4xl font-mono">Create a new lobby</p>
            </div>
            <div className="flex flex-row justify-center items-center gap-4">
                <input onChange={(e) => {
                    setLobbyId(e.target.value)
                }} type="text" placeholder="Lobby name" />
                <button onClick={handleCreateNewLobby}>Create</button>
            </div>
        </main>
    )
}