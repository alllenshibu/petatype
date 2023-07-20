import { use, useEffect, useRef, useState } from "react";

export default function Typer({ text, timer, setTimer, wpm, setWpm, accuracy, setAccuracy }) {
    const textRef = useRef(null);
    const [status, setStatus] = useState(0);
    const [textMap, settextMap] = useState([]);
    const toType = text.split('');
    const [index, setIndex] = useState(0);


    console.log(toType);

    useEffect(() => {
        //Create map with letters and color
        const map = toType.map((letter) => {
            return { letter: letter, status: -1 };
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
        handleTextInput();
    }, [index]);

    useEffect(() => {
        computeStats();
    }, [timer])

    // Compute WPM and Accuracy
    const computeStats = () => {
        let completedLetterCount = 0
        let correctLetterCount = 0
        let incorrectLetterCount = 0
        let timeRemaining = 30 - timer;
        textMap.forEach((letter) => {
            if (letter.status === 1) {
                completedLetterCount++;
                correctLetterCount++;
            } else if (letter.status === 0) {
                completedLetterCount++;
                incorrectLetterCount++;
            }
            // Number of words completed = (Completed letters / 5)
            // WPM = number of words completed / minutes elapsed
            setWpm(Math.round((completedLetterCount / 5) / (timeRemaining / 60)))
            setAccuracy(Math.round((correctLetterCount / completedLetterCount) * 100))
        })
    }

    const handleTextInput = () => {
        if (textRef.current.value.length === 0) {
            return;
        }
        const newText = text.substring(0, index + 1);
        console.log({ newText });
        if (newText === textRef.current.value) {
            setStatus(1);
            console.log(textMap[index]);

            settextMap((prev) => {
                const newMap = [...prev];
                newMap[index].status = 1;
                return newMap;
            })
        } else {
            setStatus(0);
            console.log(textMap[index]);

            settextMap((prev) => {
                const newMap = [...prev];
                newMap[index].status = 0;
                return newMap;
            });
        }
    }

    const handleBackSpace = (event) => {
        if (event.key === "Backspace" && textRef.current.value.length !== 0) {
            settextMap((prev) => {
                const newMap = [...prev];
                newMap[index].status = -1;
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
        <>
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
            <div id="text-display">{textMap.map((letter) => {
                var colors = "grey";
                if (letter.status === 1) {
                    colors = "green";
                }
                else if (letter.status === 0) {
                    colors = "red";
                }
                return <span style={{ color: colors }}>{letter.letter}</span>
            })}</div>

            <div>
                <input onBlur={() => {
                    textRef.current.focus();
                }} tabIndex="0" autoFocus="true" id="user-input" ref={textRef} onKeyDown={handleBackSpace} type="text" placeholder="Start typing..." onChange={() => {
                    setIndex(textRef.current.value.length - 1);
                    // if(status===0){
                    //     textRef.current.value = textRef.current.value.slice(0,textRef.current.value.length-1);
                    // }
                }} />
            </div>
        </>
    )
}
