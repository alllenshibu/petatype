import { useEffect, useState } from 'react'
import {io} from  'socket.io-client'

const useSocket = ()=>{  
    const [socket,setSocket] = useState(null)
  
    useEffect(() => {
        const playerId = localStorage.getItem('PetaTypeUiD')
        const socketIo = io('http://localhost:3001',{query:`playerId=${playerId}`});
        setSocket(socketIo)
  
        return () => {
          socketIo.disconnect();
        }
    },[])
  
    return socket
  }
  
  export default useSocket;
