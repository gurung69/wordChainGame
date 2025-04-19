import { useEffect, useState } from "react"
import { socket } from "../socket"
import wordChains from "../wordChain"
import Board from "./Board"
import { CircularProgress } from "@mui/material"

function MultiplayerView(){
    const [gameState, setGameState] = useState({})
    const [wordChain, setWordChain] = useState(null)

    socket.on('create-gameIndex', (playerId)=>{
        let index1 = Math.floor(Math.random() * (wordChains.length - 0 + 1)) + 0;
        let index2 = index1;

        while (index1 === index2) {
            index2 = Math.floor(Math.random() * (wordChains.length - 0 + 1)) + 0;
        }

        socket.emit('gameIndex',  {
            [playerId]: index2,
            [socket.id]:index1
        })
    })

    useEffect(()=>{
        socket.on('gameIndex', playerIndex=>{
            setWordChain(wordChains[playerIndex[socket.id]])
        })
    }, [])
    
    return (
        <div>
            {wordChain ?
                // <Board gameState={gameState} wordChain={wordChain}/>
                hehe:
                <CircularProgress/> 
            }
        </div>
    )
}

export default MultiplayerView