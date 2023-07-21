import Typer from "@/components/Typer";
import { set } from "mongoose";
import { use, useEffect, useRef, useState } from "react";

export default function Practice() {
    const text = "If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.";

    const [active, setActive] = useState(false);

    const [timer, setTimer] = useState(10);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);

    const [speedTimeGraph, setSpeedTimeGraph] = useState([]);
    const [accuracyTimeGraph, setAccuracyTimeGraph] = useState([]);

    useEffect(() => {
        let interval;
        if (active && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [active, timer]);

    useEffect(() => {
        if (timer <= 0) {
            setActive(false);
            setTimer(10);
        }
    }, [timer])


    return (
        <main className="h-screen flex flex-col justify-center items-center gap-10"
            onClick={(e) => {
                e.preventDefault();
                setActive(true);
            }}>
            <div>
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
            </div>
        </main>
    )
}
