import { use, useEffect, useRef, useState } from "react";

export default function Practice() {
    const text = "If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.";
    const textRef = useRef(null);
    const [status, setStatus] = useState(0);
    const [textMap, settextMap] = useState([]);
    const toType = text.split('');
    const [index, setIndex] = useState(0);

    const [timer, setTimer] = useState(30);

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
            clearInterval(interval); // Clear the interval when the component is unmounted
        };
    }, [])


    //to compare text with typed text
    useEffect(() => {
        //compare by text splice
        handleTextInput();
    }, [index]);

    const handleTextInput = () => {
        if (textRef.current.value.length === 0) {
            return;
        }
        const newText = text.substring(0, index + 1);
        console.log(newText);
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
        <main className="h-screen flex flex-col justify-center items-center gap-10">
            <div className="flex flex-row justify-center items-center gap-10 text-3xl font-mono">
                <p>{timer}</p>
                <p>22 WPM</p>
                <p>94%</p>
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

            {/* <p className="text-3xl font-bold tracking-wider text-neutral-700">{!status ? "Wrong" : "Right"}</p> */}
            <div>
                <input onBlur={()=>{
                     textRef.current.focus();
                }} tabIndex="0" autoFocus="true" id="user-input" ref={textRef} onKeyDown={handleBackSpace} type="text" placeholder="Start typing..." onChange={() => {
                    setIndex(textRef.current.value.length - 1);
                    // if(status===0){
                    //     textRef.current.value = textRef.current.value.slice(0,textRef.current.value.length-1);
                    // }
                }} />
            </div>
        </main>
    )
}
