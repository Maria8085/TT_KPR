import {useEffect, useRef} from 'react'
import './App.css'
import {initialCanvas} from './initialBilliard.ts'
import {ColorPiker} from "./components/ColorPiker.tsx";

function App() {
    const ref = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        if (ref.current) {
            initialCanvas(ref.current);
        }
    }, [ref])

    return (
        <>
            <canvas ref={ref} width={1000} height={600}/>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{textAlign: "left"}}>
                    <p>Двигать шары можно левой кнопкой мыши</p>
                    <p>Вызвать меню изменения цвета можно правой кнопкой мыши</p>
                </div>
                <ColorPiker/>
            </div>
        </>
    )
}

export default App
