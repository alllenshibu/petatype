
import React, { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router'
import useSocket from '@/hooks/useSocket';

export default function Create() {
    const [lobbyName, setLobbyName] = useState('')
    const socket = useSocket();
    const router = useRouter();

    const handleCreateNewLobby = async () => {
        const lobbyId = uuid();
        const userId = localStorage.getItem('PetaTypeUiD')
        if(!socket.connected){
            socket.connect();
        }
        socket.emit('create-lobby', { lobbyName: lobbyName,lobbyId: lobbyId, playerId: userId},()=>{
            router.push("/lobby/" + lobbyId+ "?lobbyName="+lobbyName)
        })
    }


    return (
        <main className="h-screen flex flex-col justify-center items-center gap-10">
            <div>
                <p className="text-4xl font-mono">Create a new lobby</p>
            </div>
            <div className="flex flex-row justify-center items-center gap-4">
                <input onChange={(e) => {
                    setLobbyName(e.target.value)
                }} type="text" placeholder="Lobby name" />
                <button onClick={handleCreateNewLobby}>Create</button>
            </div>
        </main>
    )
}