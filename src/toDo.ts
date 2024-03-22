import {Ball} from "./components/Ball.ts";


export function initialCanvas(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) {
        return null
    }
    const shapes = [
        new Ball({
            context, position: [100, 100], radius: 50, color: "#ff00ff", delta: [2, 0]
        }),
        new Ball({
            context, position: [300, 100], radius: 20, color: "#00ff00", delta: [-2, 0]
        }),
    ]

    function draw() {
        if (!context) {
            return null;
        }
        context.beginPath();
        context.fillStyle = '#0c5705';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.closePath();
        shapes.forEach((shape,index) => {
            shape.updatePosition();
            shapes.forEach((otherBall, otherIndex) => {
                if(index!==otherIndex){
                    shape.checkBallCollision(otherBall)
                }
            })
            shape.draw();
        });
        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
}