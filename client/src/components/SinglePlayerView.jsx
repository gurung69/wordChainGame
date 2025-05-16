import wordChains from "../wordChain";
import Board from "./Board";
import { useEffect, useState } from 'react'

function SinglePlayerView(){
    const wordChain = wordChains[getIndex()]
    const [guess, setGuess] = useState('')
    const [wordIndex, setWordIndex] = useState(1)
    const [shownLetters, setShownLetters] = useState(0)

    const today = new Date();
    const date = today.toLocaleDateString()
    const [gameState, setGameState] = useState(JSON.parse(localStorage.getItem(date)))

    // function to get the index of the word chain puzzle for the day
    function getIndex(){
        const today = new Date();
        const dateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        let hash = 0;
        for (let i = 0; i < dateKey.length; i++) {
        hash = dateKey.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash) % wordChains.length;
    }

    // function to store game state in local storage
    function storeGameState(){
        let gameState = JSON.parse(localStorage.getItem(date))
        if (gameState){
            gameState.currentWordIndex = wordIndex
            gameState.lettersShown = shownLetters
            localStorage.setItem(date, JSON.stringify(gameState))
        }
        else{
            gameState = {
                currentWordIndex: wordIndex,
                lettersShown: shownLetters,
            }
            localStorage.setItem(date, JSON.stringify(gameState))
        }

        setGameState(gameState)
    }

    function checkGuess(){
        if (wordChain[wordIndex].toLowerCase() === guess.toLowerCase() || wordChain[wordIndex].length-1 === shownLetters){
          setWordIndex(wordIndex + 1)
          setShownLetters(0)
        }
        else{
          setShownLetters(shownLetters + 1)
        }
    }

    async function handleSubmit(e){
        e.preventDefault()
        await checkGuess()
        setGuess('')
    }

    useEffect(()=>{
        if (gameState){
            setWordIndex(gameState.currentWordIndex)
            setShownLetters(gameState.lettersShown)
        } 
    }, [])

    useEffect(()=>{
        storeGameState()
    }, [wordIndex, shownLetters])

    function checkWin(){
        if (wordIndex === wordChain.length){
            setTimeout(() => alert("You Win!"), 500)
        }
    }

    useEffect(()=>{
        checkWin()
    }, [wordIndex])

    return (
        <>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{today.toDateString()}</h1>

            <Board
                gameState={gameState}
                wordChain={wordChain}
            />

            <form onSubmit={handleSubmit} className="flex justify-center gap-3">
                    <input 
                        type="text" 
                        value={guess}
                        placeholder="Guess the word..." 
                        onChange={e => setGuess(e.target.value)}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-2/3"
                    />
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer"
                    >
                        Submit
                    </button>
            </form>
        </>
    )
}

export default SinglePlayerView;