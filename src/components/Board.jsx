import { useEffect, useState } from "react"

function Board({gameState, wordChain }){
    const [wordIndex, setWordIndex] = useState(1)
    const [words, setWords] = useState([])
    const [guess, setGuess] = useState('')

    const today = new Date();
    const date = today.toLocaleDateString()

    // set up word board
    function setUpGame(){    
        gameState && setWordIndex(gameState.wordsCompleted + 1)

        setWords(wordChain.map((word,index)=>{
            if (index === 0){
            return(
                <li key={index} className="text-2xl font-semibold">
                {(word[0].toUpperCase() + word.slice(1)).split("").join(" ")}
                </li>
            )
            }
            else if (gameState && index <= gameState.wordsCompleted){
            return (
                <li key={index} className='text-2xl text-green-500'>
                {(word[0].toUpperCase() + word.slice(1)).split("").join(" ")}
                </li>
            )
            }
            else{
            return(
                <li key={index} className="text-2xl text-gray-600">
                {word[0].toUpperCase() + " _".repeat(word.length - 1)}
                </li>
            )
            }
        }))
    }

    // function to store game state in local storage
    function storeGameState(){
        let gameState = JSON.parse(localStorage.getItem(date))
        if (gameState){
        gameState.wordsCompleted = wordIndex
        localStorage.setItem(date, JSON.stringify(gameState))
        }
        else{
        gameState = {
            wordsCompleted: wordIndex
        }
        localStorage.setItem(date, JSON.stringify(gameState))
        }
    }

    function checkGuess(){
        if (wordChain[wordIndex].toLowerCase() === guess.toLowerCase()){
          const wordList = document.getElementsByTagName('li')[wordIndex]
          wordList.textContent = (wordChain[wordIndex][0].toUpperCase() + wordChain[wordIndex].slice(1)).split("").join(" ")
          wordList.classList.remove("text-red-500")
          wordList.classList.add("text-green-500")
          storeGameState()
          setWordIndex(wordIndex + 1)
        }
        else{
          const wordList = document.getElementsByTagName('li')[wordIndex]
          const visibleWord = wordList.textContent.replace(/[_\s]/g, "");
          wordList.textContent = (wordChain[wordIndex][0].toUpperCase() + " " + wordChain[wordIndex].slice(1, visibleWord.length+1).split("").join(" ") + " _".repeat(wordChain[wordIndex].length - visibleWord.length - 1))
          wordList.classList.add("text-red-500")
        }
    }

    // function to highlight the current word
    function updateHighlight(){
        const movingBorder = document.getElementById('moving-border')
        const wordList = document.getElementsByTagName('li')[wordIndex]
        if (movingBorder && wordList) {
        movingBorder.style.top = `${wordList.offsetTop}px`;
        movingBorder.style.height = `${wordList.offsetHeight}px`;
        movingBorder.style.width = `${wordList.offsetWidth}px`
        }
    }

    function checkWin(){
        if (wordIndex === wordChain.length){
            setTimeout(() => alert("You Win!"), 500)
        }
    }

    async function handleSubmit(e){
        e.preventDefault()
        await checkGuess()
        setGuess('')
    }

    useEffect(()=>{
        checkWin()
    }, [wordIndex])

    useEffect(()=>{
        setUpGame()
    }, [])

    useEffect(() => {
    if (words.length > 0) {
        updateHighlight()
    }
    }, [words, wordIndex]);

    return(
        <>
            <div className="mb-6">
                <ul className="space-y-4 w-2/3 mx-auto relative">
                    {words}
                    <div className='absolute border rounded-xl border-blue-500 transition-all duration-500 ease-in-out' id='moving-border'></div>
                </ul>
            </div>
            
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

export default Board;