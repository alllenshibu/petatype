import Typer from "@/components/Typer";
import { use, useEffect, useRef, useState } from "react";

export default function Practice() {
    const text = "If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.";
    const [timer, setTimer] = useState(30);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);

    const [speedTimeGraph, setSpeedTimeGraph] = useState([]);
    const [accuracyTimeGraph, setAccuracyTimeGraph] = useState([]);

    return (
        <main className="h-screen flex flex-col justify-center items-center gap-10">
            <Typer text={text} timer={timer} setTimer={setTimer} wpm={wpm} setWpm={setWpm} accuracy={accuracy} setAccuracy={setAccuracy} speedTimeGraph={speedTimeGraph} setSpeedTimeGraph={setSpeedTimeGraph} accuracyTimeGraph={accuracyTimeGraph} setAccuracyTimeGraph={setAccuracyTimeGraph} />
        </main>
    )
}
