import React from 'react'

const LobbyWaitingModal = () => {
  return (
    <>
                    <div className=' absolute h-screen w-full bg-white-900 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-100
'>
            </div>
                <div className='absolute bg-gray-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-30 border border-gray-800
    h-2/3 w-1/4 flex items-center justify-center z-50'>
                    <div className=''>Waiting for Players to Join....</div>
                </div>
    </>
  )
}

export default LobbyWaitingModal