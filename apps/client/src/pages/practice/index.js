import axios from "axios";
import Typer from "@/components/Typer";
import { useEffect, useState } from "react";
import { set } from "mongoose";


const t = "If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.";


export default function Practice() {
    const [text, setText] = useState("");
    const [textFetched, setTextFetched] = useState(false);

    const [active, setActive] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [timer, setTimer] = useState(10);
    const [progress,setProgress] = useState(0); 

    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [speedTimeGraph, setSpeedTimeGraph] = useState([]);
    const [accuracyTimeGraph, setAccuracyTimeGraph] = useState([]);

    const fetchText = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/text`);
        setText(res.data.text);
        // setText(t);
        console.log(res.data.text);
        setTextFetched(true);
    };

    const handleGameStart = () => {
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
            fetchText();
        }
    }
    useEffect(() => {
        fetchText();
    }, []);

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
                        <div className="flex flex-row justify-center items-center gap-10">
                            <p>Mode</p>
                            <select>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
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
    );
}
