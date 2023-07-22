import axios from 'axios';

import Typer from '@/components/Typer'
import useSocket from '@/hooks/useSocket';
import LobbyWaitingModal from '@/modals/LobbyWaitingModal';
import { get, set } from 'mongoose';
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
    const [Lobbyplayers, setLobbyPlayers] = useState([]);
    const [start,setStart] = useState(false);

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
            setStart(true)
        } else if (gameEnded === true) {
            console.log("ENDED Players")
            setStart(false)
            console.log(Lobbyplayers);
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

    useEffect(()=>{
        if(socket && start === true){
            socket.emit('start-lobby', { lobbyId: router.query.id, text: text });
        }

        if(start === true){
            let countdownInterval;
            countdownInterval = setInterval(() => {
                    setCountdown((prev) => prev - 1);
                    
                    if(countdown === 0){
                        clearInterval(countdownInterval);
                    }
            }, 1000);
            return () => clearInterval(countdownInterval);
        }
    },[start,socket])

    const updateLobby = (data) => {
        if(socket){
            socket.emit('update-lobby', data)
        }
    }

    const findPlayerIndex = (playerId) => {
        console.log("Players")
        console.log(Lobbyplayers)
        return (Lobbyplayers.findIndex((player) => {
            return player.playerId === playerId
        }))
    }

    const findBySocketId = (SocketID) => {
        console.log(Lobbyplayers);
        return (players.findIndex((player) => {
            return player.socketId === SocketID
        }))
    }

    // const getPlayers = () => {
    //     if(socket){
    //         socket.emit('get-players', { lobbyId: router.query.id},(Newplayers)=>{
    //             console.log("Players are : ")
    //             console.log(Newplayers)
    //             setPlayers([...Newplayers])
    //         });
         // }
    // }

    useEffect(() => {
        const playerId = localStorage.getItem('PetaTypeUiD');
        console.log("Adding self to lobby");
        Lobbyplayers.push({ name: playerId, playerId:playerId, wpm: 0, accuracy: 0, progress: 0, socketId: "Self" })
        setLobbyPlayers([...Lobbyplayers])
    },[])

    useEffect(() => {
        // fetchText();
        // Perform localStorage action
        const playerId = localStorage.getItem('PetaTypeUiD');
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
            updateLobby({ lobbyId: router.query.id, playerId: localStorage.getItem('PetaTypeUiD') });

            socket.on('disconnect', () => {
                console.log("Disconnected socket " + socket?.id);
            })
        }


        return () => {
            socket?.removeAllListeners();
        }
    }, [socket])

    useEffect(()=>{
        if(socket){
            if (socket.disconnected) socket.connect();
            socket.on('add-player', (data) => {

                // getPlayers();

                const index = findPlayerIndex(data.playerId);
                const uid = localStorage.getItem('PetaTypeUiD')
                console.log("Adding player with socket id " + data.socketId + " at index " + index)
                if (index == -1) {
                    setLobbyPlayers((prev) => {
                        return [...prev, { name: data.playerId, playerId: data.playerId, wpm: 0, accuracy: 0, progress: 0, socketId: data.socketId }]
                    })
                    if(data.playerId != uid ){
                        socket.emit('add-players',{playerId: uid,lobbyId:data.socketId,socketId: socket.id})
                    }
                }
                else {
                    console.log("Updating socket id of player " + data.playerId + " to " + data.socketId)
                    Lobbyplayers[index].socketId = data.socketId;
                    setLobbyPlayers([...Lobbyplayers])
                    if(data.playerId != uid && data.socketId != Lobbyplayers[index].socketId){
                        socket.emit('add-players',{playerId: uid,lobbyId:data.socketId,socketId: socket.id})
                    }
                }


            });

            socket.on('start-game', (data) => {
                console.log("Starting my game")
                handleGameStart();

                setText(data.text);
                setTextFetched(true);
            })

            socket.on('remove-player', ({socketId}) => {
                // getPlayers();
                if(socketId === undefined){
                    return;
                }
                console.log("Removing player with Socket id " + socketId);
                const index = findBySocketId(socketId);
                console.log("Found at index: " + index)
                if (index != -1) {
                    Lobbyplayers.splice(index, 1);
                    setLobbyPlayers([...Lobbyplayers])
                }
            });

            socket.on('update-players',(data)=>{
                console.log("Updating players")
                console.log(data)
                const index = findPlayerIndex(data.playerId);
                console.log("Found at index: " + index)
                if (index != -1) {
                    setLobbyPlayers((prev) => {
                        prev[index].wpm = data.wpm;
                        prev[index].accuracy = data.accuracy;
                        prev[index].progress = data.progress;
                        return [...prev]
                    })
                    console.log("Changed PLAYERS")
                    console.log(Lobbyplayers)
                }
            })
        }


        return () => {
            socket?.removeAllListeners();
        }
    },[socket,Lobbyplayers])


    useEffect(() => {
        if(Lobbyplayers.length > 0){
            const playerId = localStorage.getItem('PetaTypeUiD');
            const index = findPlayerIndex(playerId);
            setLobbyPlayers((prev) => {
                prev[index].progress = progress;
                return [...prev]
            })
        }
    },[progress])

    useEffect(() => {
        if (countdown === 0 && socket) {
            setActive(true);
        }
    }, [countdown])

    useEffect(()=>{
            if(socket){
                const userId = localStorage.getItem('PetaTypeUiD')
                updateLobby({ lobbyId: router.query.id,playerData: {playerId: userId,wpm: wpm, accuracy: accuracy, progress: progress, socketId: "Self" }})
            }
    },[timer])

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
                        Lobbyplayers.map((player) => {
                            return (
                                <div>
                                    <p>{player.socketId}  {player.playerId}</p>
                                    <div className='flex flex-row h-2 relative outline rounded-md animate-pulse'>
                                        <div className='h-2 absolute bg-green-500 rounded-md  ' style={{ width: player.progress + "%" }}></div>
                                    </div>
                                </div>)
                        })
                    }
                </div>

                {!textFetched && (
                    <div className="absolute text-4xl tracking-widest">Loading...</div>
                )}
                {textFetched === true && (
                    <>
                        {!active &&
                            <div className="flex flex-row justify-center items-center gap-4">
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
                                <div className="flex flex-row justify-center items-center gap-2">
                                    <p>Duration</p>
                                    <input
                                        type='number'
                                        min='1'
                                        value={timer}
                                        onChange={(e) => {
                                            setTimer(e.target.value);
                                        }} />

                                </div>
                            </div>
                        }

                        {
                            !active &&
                            <div className='absolute text-5xl right-20 top-20'>{!gameEnded && countdown}</div>
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
                        <div>
                            {gameEnded &&
                                Lobbyplayers.map((player) => {
                                    return (
                                        <div className='flex flex-row justify-center items-center gap-4 text-xl'>
                                            <p>{player.name}</p>
                                            <p>{player.wpm} WPM</p>
                                            <p>{player.accuracy} %</p>
                                        </div>)
                                })
                            }
                        </div>
                    </>

                )}
            </main>
        </>
    )
}
