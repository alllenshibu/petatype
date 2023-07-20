import React, { useEffect, useState } from 'react'

import socket from '@/configs/socketConfig'

export default function Solo() {

    const [playerId, setPlayerId] = useState('')

    useEffect(() => {
        socket.on('connect', () => {
            console.log(socket.id)
        })
        socket.emit('new-player', "dfasfasdfs")
    }, [])

    return (
        <main>
            <p className="text-3xl font-bold tracking-wider text-neutral-700">Solo</p>
        </main>
    )
}
