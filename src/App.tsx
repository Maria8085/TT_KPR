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
    {/* <div onClick={()=>{console.log("aaaa!");
    }}>lol</div> */}
      <canvas ref={ref} width={1000} height={800}/>
    </>
  )
}

export default App
