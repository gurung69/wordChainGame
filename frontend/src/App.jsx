import { useEffect, useState } from 'react'
import './App.css'
import wordChains from './static/wordchian'

function App() {
  const wordChain = wordChains[0]
  const [guess, setGuess] = useState('')
  const [wordIndex, setWordIndex] = useState(1)
  
  const words = wordChain.map((word, index)=>{
    if (index === 0){
      return (<li key={index}>{(word[0].toUpperCase() + word.slice(1)).split("").join(" ")}</li>)
    }
    return(
      <li key={index}>{word[0].toUpperCase() + " _".repeat(word.length - 1)}</li>
    )
  })

  function checkWin(){
    if (wordIndex === wordChain.length){
      alert("You Win!")
    }
  }

  function checkGuess(){
    if (wordChain[wordIndex].toLowerCase() === guess.toLowerCase()){
      const wordList = document.getElementsByTagName('li')[wordIndex]
      wordList.textContent = (wordChain[wordIndex][0].toUpperCase() + wordChain[wordIndex].slice(1)).split("").join(" ")
      wordList.classList.add("text-green-500")
      setWordIndex(wordIndex + 1)
    }
    else{
      const wordList = document.getElementsByTagName('li')[wordIndex]
      const visibleWord = wordList.textContent.replace(/[_\s]/g, "");
      wordList.textContent = (wordChain[wordIndex][0].toUpperCase() + " " + wordChain[wordIndex].slice(1, visibleWord.length+1).split("").join(" ") + " _".repeat(wordChain[wordIndex].length - visibleWord.length - 1))
    }
  }

  function handleSumbit(e){
    e.preventDefault()
    checkGuess()
  }
  
  useEffect(()=>{
    checkWin()
  }, [wordIndex])

  return (
    <>
      <ul>
        {words}
      </ul>
      <form onSubmit={handleSumbit}>
        <input type="text" value={guess}
        onChange={e=>setGuess(e.target.value)}
        className='border-1'/>
      </form>
    </>
  )
}

export default App
