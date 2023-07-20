import Typer from '@/components/Typer'
import LobbyWaitingModal from '@/modals/LobbyWaitingModal';
import { useRouter } from 'next/router'
import { useState } from 'react';

export default function Lobby() {
    const text = "If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.";
    const [timer, setTimer] = useState(30);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);

    const [speedTimeGraph, setSpeedTimeGraph] = useState([]);
    const [accuracyTimeGraph, setAccuracyTimeGraph] = useState([]);
    const router = useRouter()
    
    return (
        <>
        <main className="h-screen flex flex-col justify-center items-center gap-10">
            <LobbyWaitingModal />
            <div>
                <p className="text-4xl font-mono">We at lobby {router.query.id}</p>
            </div>
            <div>
                <div>
                    <p>Lazy Fox</p>
                    <div className='flex flex-row outline rounded-md animate-pulse'>
                        <div className='h-2 w-48 bg-red-600'></div>
                        <div className='h-2 w-48 bg-transparent'></div>
                    </div>
                </div><div>
                    <p>Funny Weasel</p>
                    <div className='flex flex-row outline rounded-md animate-pulse'>
                        <div className='h-2 w-40 bg-red-600'></div>
                        <div className='h-2 w-54 bg-transparent'></div>
                    </div>
                </div>
                <div>
                    <p>Cunning Owl</p>
                    <div className='flex flex-row outline rounded-md'>
                        <div className='h-2 w-10 bg-green-300'></div>
                        <div className='h-2 w-84 bg-transparent'></div>
                    </div>
                </div>
                <div>
                    <p>Sassy Cat</p>
                    <div className='flex flex-row outline rounded-md animate-pulse'>
                        <div className='h-2 w-48 bg-red-600'></div>
                        <div className='h-2 w-48 bg-transparent'></div>
                    </div>
                </div>
                <div>
                    <p className='font-bold tracking-widest'>You</p>
                    <div className='flex flex-row outline rounded-md'>
                        <div className='h-2 w-40 bg-green-300'></div>
                        <div className='h-2 w-48 bg-transparent'></div>
                    </div>
                </div>
            </div>
            <div>
                <Typer text={text} timer={timer} setTimer={setTimer} wpm={wpm} setWpm={setWpm} accuracy={accuracy} setAccuracy={setAccuracy} speedTimeGraph={speedTimeGraph} setSpeedTimeGraph={setSpeedTimeGraph} accuracyTimeGraph={accuracyTimeGraph} setAccuracyTimeGraph={setAccuracyTimeGraph} />
            </div>
        </main>
        </>
    )
}
