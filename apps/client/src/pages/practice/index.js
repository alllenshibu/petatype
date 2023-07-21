import axios from "axios";
import Typer from "@/components/Typer";
import { useEffect, useState } from "react";


const t = "If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.";


export default function Practice() {
    const [text, setText] = useState(t);
    const [textFetched, setTextFetched] = useState(false);

    const [active, setActive] = useState(false);

    const [timer, setTimer] = useState(10);

    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [speedTimeGraph, setSpeedTimeGraph] = useState([]);
    const [accuracyTimeGraph, setAccuracyTimeGraph] = useState([]);

    const fetchText = async () => {
        // const res = await axios.get("http://localhost:3001/text");
        // setText(res.data.text);
        setTextFetched(t);
    };

    useEffect(() => {
        fetchText();
    }, []);

    return (
        <main
            className="h-screen flex flex-col justify-center items-center gap-10"
            onClick={(e) => {
                e.preventDefault();
                setActive(true);
            }}
            onKeyDown={(e) => {
                setActive(true);
            }}
        >
            {!textFetched && (
                <div className="absolute text-4xl tracking-widest">Loading...</div>
            )}
            {textFetched && (
                <>
                    {!active && (
                        <div className="absolute text-4xl tracking-widest">Click anywhere to start</div>
                    )}
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
                        setAccuracyTimeGraph={setAccuracyTimeGraph}
                    />
                </>
            )}
        </main>
    );
}
