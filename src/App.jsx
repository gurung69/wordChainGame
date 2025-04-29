import { useEffect, useState } from 'react'
import './App.css'
import wordChains from './wordChain'
import SinglePlayerView from './components/SinglePlayerView'
import { socket } from './socket'
import MultiplayerView from './components/MultiplayerView'
import CreateRoom from './components/CreateRoom'
import JoinRoom from './components/JoinRoom'

function App() {
  const [multiplayerView, setMultiplayerView] = useState(false)

  useEffect(()=>{
    socket.on('room-joined', ()=>{
      setMultiplayerView(true)
    })
  }, [])

  return (
    <div className='h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex justify-center items-center'>
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-lg w-full text-center">
        {multiplayerView? <MultiplayerView/>: 
        <>
          <CreateRoom />
          <JoinRoom />
          <SinglePlayerView />
        </>
        }
      </div>
    </div>
  )
}

export default App
