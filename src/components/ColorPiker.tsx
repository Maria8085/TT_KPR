import {useEffect, useState} from "react";
import {Sketch} from "@uiw/react-color";
import {CustomEventType} from "../initialBilliard.ts";
import {Ball} from "./Ball.ts";

export const ColorPiker = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [ball, setBall] = useState<Ball | null>(null)
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
        <Sketch
            color={ball?.color as string}
            style={{position: "absolute", bottom: "30px", right: "30px"}}
            onChange={(color) => {
                if (ball) {
                    ball.color = color.hexa
                }
            }}/>
    );
}