import { useEffect, useState } from 'react'
import {io} from  'socket.io-client'

const useSocket = ()=>{  
    const [socket,setSocket] = useState(null)
  
    useEffect(() => {
        const playerId = localStorage.getItem('PetaTypeUiD')
        const socketIo = io(NEXT_PUBLIC_API_URL);
        setSocket(socketIo)

        socketIo.on('connect',()=>{
          socketIo.emit('new-user',playerId);
        })
  
        return () => {
          socketIo.disconnect();
        }
    },[])
  
    return socket
  }
  
  export default useSocket;
