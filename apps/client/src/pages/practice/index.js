import { use, useEffect, useRef, useState } from "react";

export default function Practice() {
    const text = "If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.";
    const textRef = useRef(null);
    const [textMap, settextMap] = useState([]);
    const toType = text.split(' ');
    const [index, setIndex] = useState(0);
    const [innerIndex, setinnerIndex] = useState(-1);
    const [timer, setTimer] = useState(30);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);

    const [speedTimeGraph, setSpeedTimeGraph] = useState([]);
    const [accuracyTimeGraph, setAccuracyTimeGraph] = useState([]);


    useEffect(() => {
        //Create map with letters and color
        const map = toType.map((word) => {
            return word.split('').map((letter) => {
                return { letter: letter, status: -1 };
            })
        });
        settextMap(map);
        textRef.current.focus();

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
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
    }, [timer])

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
        <main className="h-screen flex flex-col justify-center items-center gap-10">
            <div className="flex flex-row justify-evenly items-center gap-10">
                <div className="flex flex-row justify-center items-center gap-10 text-3xl font-mono">
                    <p>{timer}</p>
                    <p>{wpm} WPM</p>
                    <p>{accuracy & accuracy}%</p>
                </div>
                <div>
                    <select>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            </div>
            <div id="text-display">{textMap.map((word, outerInd) => {
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
            </div>
            <div>
                <input onBlur={() => {
                    textRef.current.focus();
                }} tabIndex="0" autoFocus="true" id="user-input" ref={textRef} onKeyDown={handleBackSpace} type="text" placeholder="Start typing..." onChange={(event) => {
                    if (innerIndex != -1 && textRef.current.value.split(' ').slice(-1)[0].length > text.split(' ')[index].length) {
                        textRef.current.value = textRef.current.value.slice(0, textRef.current.value.length - 1);
                    }
                    setIndex(textRef.current.value.split(' ').length - 1);
                    setinnerIndex(textRef.current.value.split(' ').slice(-1)[0].length - 1) //put 0 index
                }} />
            </div>
        </main>
    )
}
