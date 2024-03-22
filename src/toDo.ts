import {Ball} from "./components/Ball.ts";


export function initialCanvas(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) {
        return null
    }
    const shapes = Array.from({length: 2},(_,index) => {
        return new Ball({
            context, position: [index*50+50,index*50], radius:Math.random()*50, color: "#ff00ff", delta: [Math.random()*20, Math.random()*20]
        })
    })

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