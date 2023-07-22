import useSocket  from '@/hooks/useSocket';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react'

export default function join() {
    const [lobbyId, setLobbyId] = useState('')
    const socket = useSocket();
    const router = useRouter();

    const handlejoinNewLobby = async () => {
        const userId = localStorage.getItem('PetaTypeUiD')
        if(socket){
            if(!socket.connected){
                socket.connect();
            }
            router.push("/lobby/" + lobbyId+ "?lobbyName="+"LobbyName to find from db"+"&guest=true")
            // socket.emit('join-lobby', { lobbyId: lobbyId, playerId: userId},()=>{
                
            // })
        }
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