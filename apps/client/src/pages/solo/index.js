import axios from "axios";

import { use, useEffect, useRef, useState } from "react";
import socket from '@/configs/socketConfig'

import Typer from "@/components/Typer";

// Not implementted

export default function Practice() {
    const [difficulty, setDifficulty] = useState("easy"); // ["easy","medium","hard"

    const [text, setText] = useState("");
    const [textFetched, setTextFetched] = useState(false);

    const [active, setActive] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [timer, setTimer] = useState(10);
    const [progress, setProgress] = useState(0);

    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [speedTimeGraph, setSpeedTimeGraph] = useState([]);
    const [accuracyTimeGraph, setAccuracyTimeGraph] = useState([]);


    const fetchText = async () => {
        console.log(difficulty);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/text?${difficulty}`);
        setText(res.data.text);
        // setText(t);
        console.log(res.data.text);
        setTextFetched(true);
    };

    const handleGameStart = async () => {
        if (gameEnded === false) {
            setActive(true);
        } else if (gameEnded === true) {
            setGameEnded(false);
            setActive(true);
            setTimer(10);
            setWpm(0);
            setAccuracy(0);
            setSpeedTimeGraph([]);
            setAccuracyTimeGraph([]);
            setTextFetched(false);
            await fetchText();
        }
    }

    const handleFinish = () => {
        console.log({ wpm, accuracy, speedTimeGraph, accuracyTimeGraph })
        socket.emit('solo-finish', { wpm, accuracy, speedTimeGraph, accuracyTimeGraph })
    }

    useEffect(() => {
        fetchText();

        socket.on('connect', () => {
            console.log({ playerId: socket.id })
        })
        socket.emit('new-player')

        if (active) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);


            return () => {
                clearInterval(interval);
            };
        }
    }, [])

    useEffect(() => {
        if (timer <= 0) {
            setActive(false);
            handleFinish();
        }
    }, [timer])

    return (
        <main
            className="h-screen flex flex-col justify-center items-center gap-10"
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleGameStart();
                }
            }}
        >
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
    )
}


