import { set } from "mongoose";
import { use, useEffect, useRef, useState } from "react";

export default function Typer({
    text,
    active,
    setActive,
    timer,
    setTimer,
    wpm,
    setWpm,
    accuracy,
    setAccuracy,
    speedTimeGraph,
    setSpeedTimeGraph,
    accuracyTimeGraph,
    setAccuracyTimeGraph }) {

    const textRef = useRef(null);
    const [textMap, settextMap] = useState([]);
    const toType = text.split(' ');
    const [index, setIndex] = useState(0);
    const [innerIndex, setinnerIndex] = useState(-1);

    useEffect(() => {
        //Create map with letters and color
        const map = toType.map((word) => {
            return word.split('').map((letter) => {
                return { letter: letter, status: -1 };
            })
        });
        settextMap(map);
        textRef.current.focus();
    }, [])

    //to compare text with typed text
    useEffect(() => {
        //compare by text splice
        if (innerIndex != -1) {
            handleTextInput();
        }
        console.log(innerIndex, index)
    }, [innerIndex]);

    useEffect(() => {
        computeStats();
        if (timer <= 0) {
            setActive(false);
            setTimer(10);
        }
    }, [timer])

    useEffect(() => {
        let interval;
        if (active && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [active, timer]);

    // Compute WPM and Accuracy
    const computeStats = () => {
        let completedLetterCount = 0
        let correctLetterCount = 0
        let incorrectLetterCount = 0
        let timeElapsed = 30 - timer;
        textMap.forEach((word) => {
            word.forEach((letter) => {
                if (letter.status === 1) {
                    completedLetterCount++;
                    correctLetterCount++;
                } else if (letter.status === 0) {
                    completedLetterCount++;
                    incorrectLetterCount++;
                }
            })

        })
        setWpm(Math.round((completedLetterCount / 5) / (timeElapsed / 60))) // Number of words completed = (Completed letters / 5)           
        setAccuracy(Math.round((correctLetterCount / completedLetterCount) * 100))         // WPM = number of words completed / minutes elapsed

        let plot = [timeElapsed, wpm];
        setSpeedTimeGraph((prev) => {
            const newMap = [...prev];
            newMap.push(plot);
            return newMap;
        })
        plot = [timeElapsed, accuracy];
        setAccuracyTimeGraph((prev) => {
            const newMap = [...prev];
            newMap.push(plot);
            return newMap;
        })
    }

    const handleTextInput = () => {
        if (textRef.current.value.length === 0) {
            return;
        }
        for (let i = 0; i <= innerIndex; i++) {
            if (textRef.current.value.split(' ').slice(-1)[0][i] !== text.split(' ')[index][i]) {
                settextMap((prev) => {
                    const newMap = [...prev];
                    newMap[index][i].status = 0;
                    return newMap;
                });
            }
            else {
                settextMap((prev) => {
                    const newMap = [...prev];
                    newMap[index][i].status = 1;
                    return newMap;
                });
            }
        }
    }


    const handleBackSpace = (event) => {
        //spacebar
        if (event.key === " " && textRef.current.value.length !== 0) {
            setinnerIndex(-1);
        }
        if (event.key === "Backspace" && textRef.current.value.length !== 0 && innerIndex !== -1) {
            settextMap((prev) => {
                const newMap = [...prev];
                newMap[index][innerIndex].status = -1;
                return newMap;
            });
        } else if (event.ctrlKey && event.key === "Backspace") {
            console.log("Ctrl+Backspace");
            settextMap((prev) => {
                const newMap = [...prev];
                newMap.forEach((letter) => {
                    letter.status = -1;
                })
                return newMap;
            });
        }
    }

    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <div className="flex flex-row justify-evenly items-center gap-10">
                <div className="flex flex-row justify-center items-center gap-10 text-3xl font-mono">
                    <p>{timer}</p>
                    <p>{wpm & wpm} WPM</p>
                    <p>{accuracy & accuracy}%</p>
                </div>
            </div>
            <div
                id="text-display"
                className={(active) ? "" : "opacity-10 blur-sm"}
            >{textMap.map((word, outerInd) => {
                return (<span className="indent-3">{word.map((letter, innerInd) => {
                    var colors = "grey";
                    var classname;
                    if (letter.status === 1) {
                        colors = "white";
                    }
                    else if (letter.status === 0) {
                        colors = "#ED2939";
                    }
                    if (innerIndex == -1 && innerInd == 0 && outerInd == index) {
                        classname = "blinker-before"
                    }
                    else if (outerInd == index && innerInd == innerIndex) {
                        classname = "blinker"
                    }
                    return <span className={classname} style={{ color: colors }}>{letter.letter}</span>
                })} </span>)
            })}
            </div >
            <div>
                <input onBlur={() => {
                    textRef.current.focus();
                }} autoComplete="off" tabIndex="0" autoFocus="true" id="user-input" ref={textRef} onKeyDown={handleBackSpace} type="text" placeholder="Start typing..." onChange={(event) => {
                    if (innerIndex != -1 && textRef.current.value.split(' ').slice(-1)[0].length > text.split(' ')[index].length) {
                        textRef.current.value = textRef.current.value.slice(0, textRef.current.value.length - 1);
                    }
                    setIndex(textRef.current.value.split(' ').length - 1);
                    setinnerIndex(textRef.current.value.split(' ').slice(-1)[0].length - 1) //put 0 index
                }} />
            </div>
        </div>
    )
}
