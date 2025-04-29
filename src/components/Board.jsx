import { useEffect, useRef, useState } from "react"

function Board({gameState, wordChain }){
    const [wordIndex, setWordIndex] = useState(1)
    const [words, setWords] = useState([])
    const [shownLetters, setShownLetters] = useState(0)
    const movingBorderRef = useRef(null);
    const listRef = useRef([])

    // set up word board
    function setUpGame(){    
        setWords(wordChain.map((word,index)=>{
            if (index === 0){
                return(
                    <li key={index} className="text-2xl font-semibold" ref={(el)=>(listRef.current[index]=el)}>
                    {(word[0].toUpperCase() + word.slice(1)).split("").join(" ")}
                    </li>
                )
            }
            else if (gameState && index < wordIndex){
                return (
                    <li key={index} className='text-2xl text-green-500' ref={(el)=>(listRef.current[index]=el)}>
                    {(word[0].toUpperCase() + word.slice(1)).split("").join(" ")}
                    </li>
                )
            }
            else if ((index === wordIndex) && shownLetters){
                return(
                    <li key={index} className="text-2xl text-red-600" ref={(el)=>(listRef.current[index]=el)}>
                    {word[0].toUpperCase() + ' ' + word.slice(1,shownLetters+1).split("").join(" ") + " _".repeat(word.length - 1 - shownLetters)}
                    </li>
                )
            }
            else{
                return(
                    <li key={index} className="text-2xl text-gray-600" ref={(el)=>(listRef.current[index]=el)}>
                    {word[0].toUpperCase() + " _".repeat(word.length - 1)}
                    </li>
                )
            }
        }))
    }

    // function to highlight the current word
    function updateHighlight(){
        // const movingBorder = document.getElementById('moving-border')
        const movingBorder = movingBorderRef.current
        const wordList = listRef.current[wordIndex]
        if (movingBorder && wordList) {
        movingBorder.style.top = `${wordList.offsetTop}px`;
        movingBorder.style.height = `${wordList.offsetHeight}px`;
        movingBorder.style.width = `${wordList.offsetWidth}px`
        }
    }

    useEffect(()=>{
        if (gameState){
            setWordIndex(gameState.currentWordIndex)
            setShownLetters(gameState.lettersShown)
        } 
    }, [gameState])

    useEffect(() => {
    if (words.length > 0) {
        updateHighlight()
    }
    }, [words, wordIndex]);

    useEffect(()=>{
        setUpGame()
    }, [shownLetters, wordIndex])

    return(
        <>
            <div className="mb-6">
                <ul className="space-y-4 w-2/3 mx-auto relative">
                    {words}
                    <div ref={movingBorderRef} className='absolute border rounded-xl border-blue-500 transition-all duration-500 ease-in-out' id='moving-border'></div>
                </ul>
            </div> 
        </>
    )
}

export default Board;