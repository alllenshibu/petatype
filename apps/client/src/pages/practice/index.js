import axios from "axios";
import Typer from "@/components/Typer";
import { useEffect, useState } from "react";

export default function Practice() {
    const [text, setText] = useState("");
    const [textFetched, setTextFetched] = useState(false);

    const [active, setActive] = useState(false);

    const [timer, setTimer] = useState(10);

    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [speedTimeGraph, setSpeedTimeGraph] = useState([]);
    const [accuracyTimeGraph, setAccuracyTimeGraph] = useState([]);

    const fetchText = async () => {
        const res = await axios.get("http://localhost:3001/text");
        setText(res.data.text);
        setTextFetched(true); // Set the textFetched state to true after fetching the text
    };

    useEffect(() => {
        fetchText(); // Trigger fetching of the text when the component mounts
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
