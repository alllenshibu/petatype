import { use, useEffect, useRef, useState } from "react";
import socket from '@/configs/socketConfig'

import Typer from "@/components/Typer";

export default function Practice() {
    const text = "If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.";

    const [active, setActive] = useState(true);

    const [timer, setTimer] = useState(30);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);

    const [speedTimeGraph, setSpeedTimeGraph] = useState([]);
    const [accuracyTimeGraph, setAccuracyTimeGraph] = useState([]);

    const handleFinish = () => {
        console.log({ wpm, accuracy, speedTimeGraph, accuracyTimeGraph })
        socket.emit('solo-finish', { wpm, accuracy, speedTimeGraph, accuracyTimeGraph })
    }

    useEffect(() => {

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
        <main className="h-screen flex flex-col justify-center items-center gap-10">
            <Typer
                text={text}
                active={active}
                setActive={setActive}
                timer={timer}
                setTimer={setTimer}
                wpm={wpm}
                setWpm={setWpm}
                accuracy={accuracy}
                setAccuracy={setAccuracy}
                speedTimeGraph={speedTimeGraph}
                setSpeedTimeGraph={setSpeedTimeGraph}
                accuracyTimeGraph={accuracyTimeGraph}
                setAccuracyTimeGraph={setAccuracyTimeGraph} />
        </main>
    )
}


