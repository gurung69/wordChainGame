import { useEffect, useState } from "react"
import { socket } from "../socket"
import wordChains from "../wordChain"
import Board from "./Board"
import { CircularProgress } from "@mui/material"

function MultiplayerView(){
    const [guess, setGuess] = useState('')
    const [gameState, setGameState] = useState(null)
    const [opponentGameState, setOpponentGameState] = useState(null)
    const [wordChain, setWordChain] = useState(null)
    const [opponentWordChain, setOpponentWordChain] = useState(null)
    const [turn, setTurn] = useState(false)
    const [wordIndex, setWordIndex] = useState(1)
    const [lettersShown, setShownLetters] = useState(0)

    function handleSetUp(){
        console.log('setting up')
        socket.emit('setup-game', wordChains.length)
    }

    function handleStartGame(gameInfo){
        console.log(wordChains[gameInfo.you])
        setWordChain(wordChains[gameInfo.you])
        setOpponentWordChain(wordChains[gameInfo.opponent])
        setTurn(gameInfo.turn)
    }

    function handleStartTurn(opponentGameState){
        setOpponentGameState(opponentGameState)
        setTurn(true)
    }

    useEffect(()=>{
        socket.on('setup-game', handleSetUp)
        socket.on('start-game', handleStartGame)
        socket.on('toogle-turn', handleStartTurn)

        return ()=>{
            socket.off('setup-game', handleSetUp)
            socket.off('start-game', handleStartGame)
            socket.off('toogle-turn', handleStartTurn)
        }
    }, [])

    function checkGuess(){
        if (wordChain[wordIndex].toLowerCase() === guess.toLowerCase()){
            setWordIndex(wordIndex+1)
        }
        else{
            setShownLetters(lettersShown + 1)
        }
    }

    function updateGameState(){
        setGameState({
            currentWordIndex: wordIndex,
            lettersShown: lettersShown
        })
    }

    async function handleSubmit(e){
        e.preventDefault()
        checkGuess()
        setGuess('')
    }

    useEffect(()=>{
        updateGameState()
    }, [wordIndex, lettersShown])

    useEffect(()=>{
        setTurn(false)
        socket.emit('toogle-turn', gameState)
    }, [gameState])
   
    
    return (
        <div>
            {wordChain ?
                <>
                    <div className="flex">
                        <div className="w-1/2">
                            <Board gameState={gameState} wordChain={wordChain} />
                        </div>
                        <div className="w-1/2">
                            <Board gameState={opponentGameState} wordChain={opponentWordChain} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex justify-center gap-3">
                        {turn ? 
                        <>
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
                        </>:
                        <p>Wating for opponent...</p>
                        }
                </form>
            </>:
            <CircularProgress/>}
        </div>
    )
}

export default MultiplayerView