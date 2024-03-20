import { useEffect, useRef } from 'react'
import './App.css'
import { initialCanvas } from './toDo'

function App() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(()=>{
    if(ref.current){
      initialCanvas(ref.current);
    }
  },[ref])

  return (
    <>
      <canvas ref={ref} width={200} height={200}/>
    </>
  )
}

export default App
