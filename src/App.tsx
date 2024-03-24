import {useEffect, useRef} from 'react'
import './App.css'
import {initialCanvas} from './initialBilliard.ts'

function App() {
    const ref = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        if (ref.current) {
            initialCanvas(ref.current);
        }
    }, [ref])

    return (
        <>
            <canvas ref={ref} width={1000} height={800}/>
        </>
    )
}

export default App
