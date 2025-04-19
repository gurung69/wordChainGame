import wordChains from "../wordChain";
import Board from "./Board";
import { useEffect, useState } from 'react'

function SinglePlayerView(){
    const wordChain = wordChains[getIndex()]


    const today = new Date();
    const date = today.toLocaleDateString()
    const gameState = JSON.parse(localStorage.getItem(date))

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

    return (
        <>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{today.toDateString()}</h1>

            <Board
                gameState={gameState}
                wordChain={wordChain}
            />
        </>
    )
}

export default SinglePlayerView;