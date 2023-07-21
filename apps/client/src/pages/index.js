import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { v4 as uuid } from 'uuid';
import axios from 'axios';


const getRandomUsername = () => {
  const adjectives = ['disguised', 'fierce', 'playful', 'cunning', 'curious', 'eager', 'gentle', 'happy', 'jolly'];
  const animals = ['panda', 'tiger', 'fox', 'lion', 'elephant', 'kangaroo', 'bear', 'koala', 'dolphin'];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  return `${randomAdjective}${randomAnimal}`;
};

export default function Home() {
  const [userID, setUserID] = useState("");
  const [newUser, setNewUser] = useState(true);
  const [userName, setUserName] = useState(getRandomUsername());

  const handleCreateNewUser = async () => {
    setUserID(uuid())
    localStorage.setItem('PetaTypeUName', userName)
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/player/new`, { player_name: userName })
    if (res.status === 200) {
      console.log("Player created")
      localStorage.setItem('PetaTypeUiD', res.data.player_id)
      setNewUser(false)
    } else {
      console.log("Error creating player")
      console.log(res)
    }
  }

  useEffect(() => {
    //If no uid in local storage
    if (!localStorage.getItem('PetaTypeUiD') || !localStorage.getItem('PetaTypeUName')) {
      setNewUser(true)
    } else {
      setNewUser(false)
      setUserName(localStorage.getItem('PetaTypeUName'))
    }
  }, [])

  return (
    <main className='h-screen flex flex-col justify-center items-center gap-10'>
      {!newUser &&
        <>
          <p className="text-5xl">PetaType</p>
          <div className='flex flex-row gap-4'>
            <button><Link href="practice">Practice</Link></button>
            <button><Link href="solo">Solo</Link></button>
            <button><Link href="create">New Lobby</Link></button>
            <button><Link href="join">Join Lobby</Link></button>
          </div>
          <p>Hi {userName}</p>
        </>
      }
      {newUser &&
        <div className='flex flex-row justify-center items-center gap-4'>
          <label htmlFor="username">Enter your username</label>
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
          <button onClick={handleCreateNewUser}>Proceed</button>
        </div>}
    </main>
  )
}
