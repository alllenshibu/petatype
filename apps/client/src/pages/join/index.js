import React, { useState, useEffect } from 'react'

import socket from '@/configs/socketConfig'

export default function join() {
    const [lobbyId, setLobbyId] = useState('')

    const handlejoinNewLobby = async () => {
        socket.on('connect', () => {
            console.log({ playerId: socket.id })
        })
        socket.emit('join-lobby', lobbyId)
    }


    return (
        <main className="h-screen flex flex-col justify-center items-center gap-10">
            <div>
                <p className="text-4xl font-mono">join a new lobby</p>
            </div>
            <div className="flex flex-row justify-center items-center gap-4">
                <input onChange={(e) => {
                    setLobbyId(e.target.value)
                }} type="text" placeholder="Lobby name" />
                <button onClick={handlejoinNewLobby}>join</button>
            </div>
        </main>
    )
}