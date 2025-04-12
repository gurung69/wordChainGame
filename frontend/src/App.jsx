import { useEffect, useState } from 'react'
import './App.css'
import wordChains from './wordChain'

function App() {
  const wordChain = wordChains[getIndex()]
  const [guess, setGuess] = useState('')
  const [wordIndex, setWordIndex] = useState(1)
  
  // displayed words 
  const words = wordChain.map((word, index) => {
    if (index === 0) {
      return (<li key={index} className="text-2xl font-semibold">{(word[0].toUpperCase() + word.slice(1)).split("").join(" ")}</li>)
    }
    return (
      <li key={index} className="text-2xl text-gray-600">{word[0].toUpperCase() + " _".repeat(word.length - 1)}</li>
    )
  })

  function checkWin(){
    if (wordIndex === wordChain.length){
      setTimeout(() => alert("You Win!"), 500)
    }
  }

  function getIndex(){
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
      hash = dateKey.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % wordChains.length;
  }

  function checkGuess(){
    if (wordChain[wordIndex].toLowerCase() === guess.toLowerCase()){
      const wordList = document.getElementsByTagName('li')[wordIndex]
      wordList.textContent = (wordChain[wordIndex][0].toUpperCase() + wordChain[wordIndex].slice(1)).split("").join(" ")
      wordList.classList.remove("text-red-500")
      wordList.classList.add("text-green-500")
      setWordIndex(wordIndex + 1)
    }
    else{
      const wordList = document.getElementsByTagName('li')[wordIndex]
      const visibleWord = wordList.textContent.replace(/[_\s]/g, "");
      wordList.textContent = (wordChain[wordIndex][0].toUpperCase() + " " + wordChain[wordIndex].slice(1, visibleWord.length+1).split("").join(" ") + " _".repeat(wordChain[wordIndex].length - visibleWord.length - 1))
      wordList.classList.add("text-red-500")
    }
  }

  async function handleSumbit(e){
    e.preventDefault()
    await checkGuess()
    setGuess('')
  }
  
  useEffect(()=>{
    checkWin()
  }, [wordIndex])

  return (
    <div className='h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex justify-center items-center'>
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{new Date().toDateString()}</h1>
        
        <div className="mb-6">
          <ul className="space-y-4">
            {words}
          </ul>
        </div>
        
        <form onSubmit={handleSumbit} className="flex justify-center gap-3">
          <input 
            type="text" 
            value={guess}
            placeholder="Guess the word..." 
            onChange={e => setGuess(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-2/3"
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
