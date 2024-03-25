import {useEffect, useState} from "react";
import {Sketch} from "@uiw/react-color";
import {CustomEventType} from "../initialBilliard.ts";
import {Ball} from "./Ball.ts";

export const ColorPiker = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [ball, setBall] = useState<Ball>(null)
    useEffect(() => {
        document.addEventListener('clickBall', ({detail}: { detail: CustomEventType }) => {
            if (detail.ball) {
                setBall(detail.ball)
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
            console.log(detail)
        })
    }, []);
    if (!isVisible) return null
    return (
        <Sketch onChange={(color) => {
            ball.color = color.hexa
        }}/>
    );
}