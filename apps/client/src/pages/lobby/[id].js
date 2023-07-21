import axios from 'axios';

import Typer from '@/components/Typer'
import useSocket from '@/hooks/useSocket';
import LobbyWaitingModal from '@/modals/LobbyWaitingModal';
import { set } from 'mongoose';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

const t = "If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.";


export default function Lobby() {

    const [text, setText] = useState("");
    const [textFetched, setTextFetched] = useState(false);
    const [difficulty, setDifficulty] = useState("easy");

    const [timer, setTimer] = useState(30);
    const [countdown, setCountdown] = useState(5);

    const [active, setActive] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);

    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [progress, setProgress] = useState(0);
    const socket = useSocket();
    const [players, setPlayers] = useState([]);


    const [speedTimeGraph, setSpeedTimeGraph] = useState([]);
    const [accuracyTimeGraph, setAccuracyTimeGraph] = useState([]);
    const router = useRouter()

    const fetchText = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/text`);
        setText(res.data.text);
        // setText(t);
        console.log(res.data.text);
        setTextFetched(true);
    };

    const handleGameStart = async () => {
        if (gameEnded === false) {
            let countdownInterval;

            countdownInterval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(countdownInterval);
        } else if (gameEnded === true) {

            setGameEnded(false);
            setTimer(30);
            setWpm(0);
            setAccuracy(0);
            setSpeedTimeGraph([]);
            setAccuracyTimeGraph([]);
            setTextFetched(false);
            await fetchText();
            setCountdown(5);
        }
    }

    const updateLobby = (data) => {
        socket.emit('update-lobby', data)
    }

    const findPlayerIndex = (playerId) => {
        console.log("INDEX OF SEARCH FOR ADD " + playerId);
        console.log(players);
        return (players.findIndex((player) => {
            return player.playerId === playerId
        }))
    }

    const findBySocketId = (SocketID) => {
        console.log(players);
        return (players.findIndex((player) => {
            return player.socketId === SocketID
        }))
    }

    useEffect(() => {
        // fetchText();
        // Perform localStorage action
        const playerId = localStorage.getItem('PetaTypeUiD');
        setPlayers([{ name: playerId, wpm: 0, accuracy: 0, progress: 0, socketId: "Self" },])
        if (socket) {
            socket.emit('join-lobby', { lobbyId: router.query.id, playerId: playerId });
        }
    }, [socket])

    useEffect(() => {
        const playerId = localStorage.getItem('PetaTypeUiD');
        if (socket) {
            socket.on('connect', () => {
                console.log("Socket Connected , Registering Listeners, Socket ID: " + socket.id)
            })

            if (socket.disconnected) socket.connect();
            socket.on('add-player', (data) => {
                const index = findPlayerIndex(data.playerId);
                console.log("Adding player with socket id " + data.socketId + " at index " + index)
                if (index == -1) {
                    setPlayers((prev) => {
                        return [...prev, { name: data.playerId, playerId: data.playerId, wpm: 0, accuracy: 0, progress: 0, socketId: data.socketId }]
                    })
                }
                else {
                    players[index].socketId = data.socketId;
                    setPlayers([...players])
                }
            });

            socket.on('remove-player', (socketId) => {
                console.log("Removing player with Socket id " + socketId);
                const index = findBySocketId(socketId);
                console.log("Found at index: " + index)
                if (index != -1) {
                    players.splice(index, 1);
                    setPlayers([...players])
                }
            });

            updateLobby({ lobbyId: router.query.id, playerId: localStorage.getItem('PetaTypeUiD') });

            socket.on('disconnect', () => {
                socket.emit('message', "Disconnecting");
                console.log("Disconnected socket " + socket?.id);
            })
        }


        return () => {
            socket?.removeAllListeners();
            socket?.close();
            // socket?.off('connect')
            // socket?.off('message')
            // socket?.off('disconnect')
            // socket?.off('connect_error')
            // socket?.off('add_player')
        }
    }, [socket, players])

    useEffect(() => {
        if (countdown === 0) {
            setActive(true);
        }
    }, [countdown])

    useEffect(() => {
        fetchText();
    }, [difficulty]);

    useEffect(() => {
        fetchText();
    }, []);

    // const emit = () => {
    //     if (socket.disconnected) socket.connect();
    //     socket.emit('messages', { message: "Hello" })
    // }

    return (
        <>
            <main
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleGameStart();
                    }
                }}
                className="h-screen flex flex-col justify-center items-center gap-10">
                <div className='text-center'>
                    <p className="text-4xl font-mono">We at lobby {router.query.lobbyName}</p>
                    {/* <button onClick={emit}>EMIT</button> */}
                    <div className="text-xl font-mono flex items-center gap-2 hover:cursor-pointer" onClick={() => {
                        navigator.clipboard.writeText(router.query.id)
                    }}>Room id:  {router.query.id} <div className='text-sm'>(click to copy)</div></div>
                </div>
                <div className='w-1/3'>
                    {
                        players.map((player) => {
                            return (
                                <div>
                                    <p>{player.socketId}</p>
                                    <div className='flex flex-row h-2 relative outline rounded-md animate-pulse'>
                                        <div className='h-2 absolute bg-green-500 rounded-md  ' style={{ width: player.progress + "%" }}></div>
                                    </div>
                                </div>)
                        })
                    }
                </div>

                {/* <div>
                <div>
                    <p>Lazy Fox</p>
                    <div className='flex flex-row outline rounded-md animate-pulse'>
                        <div className='h-2 w-48 bg-red-600'></div>
                        <div className='h-2 w-48 bg-transparent'></div>
                    </div>
                </div>
                <div>
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
            </div> */}
                {!textFetched && (
                    <div className="absolute text-4xl tracking-widest">Loading...</div>
                )}
                {textFetched === true && (
                    <>
                        {!active &&
                            <div className="flex flex-row justify-center items-center gap-10">
                                <p>Mode</p>
                                <select onChange={(e) => {
                                    setDifficulty(e.target.value);
                                    fetchText();
                                }}>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        }
                        {
                            !active &&
                            <div>{!gameEnded && countdown}</div>
                        }
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                handleGameStart();
                            }}
                        >
                            <Typer
                                text={text}
                                active={active}
                                setActive={setActive}
                                gameEnded={gameEnded}
                                setGameEnded={setGameEnded}
                                timer={timer}
                                setTimer={setTimer}
                                progress={progress}
                                setProgress={setProgress}
                                wpm={wpm}
                                setWpm={setWpm}
                                accuracy={accuracy}
                                setAccuracy={setAccuracy}
                                speedTimeGraph={speedTimeGraph}
                                setSpeedTimeGraph={setSpeedTimeGraph}
                                accuracyTimeGraph={accuracyTimeGraph}
                                setAccuracyTimeGraph={setAccuracyTimeGraph}
                            />
                        </div>
                    </>

                )}
            </main>
        </>
    )
}
