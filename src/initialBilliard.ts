import {Ball} from "./components/Ball.ts";


export function initialCanvas(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    let mouseX = 0;
    let mouseY = 0;
    let grabbedBall: Ball | null = null
    if (!context) {
        return null
    }
    const shapes = [
        new Ball({
            context, position: [0, 0], radius: Math.random() * 50 + 20, delta: [Math.random() * 20, Math.random() * 20]
        }),
        new Ball({
            context,
            position: [200, 200],
            radius: Math.random() * 50 + 20,
            color: "#ff00ff",
            delta: [Math.random() * 20, Math.random() * 20]
        }),
        new Ball({
            context,
            position: [400, 200],
            radius: Math.random() * 50 + 20,
            color: "#ff00ff",
            delta: [Math.random() * 20, Math.random() * 20]
        }),
        new Ball({
            context,
            position: [200, 400],
            radius: Math.random() * 50 + 20,
            color: "#ff00ff",
            delta: [Math.random() * 20, Math.random() * 20]
        }),
        new Ball({
            context,
            position: [400, 400],
            radius: Math.random() * 50 + 20,
            color: "#ff00ff",
            delta: [Math.random() * 20, Math.random() * 20]
        })
    ]

    canvas.addEventListener('mousedown', () => {
        // Check if mouse is over a ball
        shapes.forEach((ball) => {
            if (ball.isHovered) {
                ball.target = [mouseX, mouseY]
                ball.isGrabbed = true
                grabbedBall = ball
            }
        })
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        if (grabbedBall) {
            grabbedBall.target = [mouseX, mouseY]
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (grabbedBall) {
            grabbedBall.isGrabbed = false;
            grabbedBall = null;
        }
    });

    function draw() {
        if (!context) {
            return null;
        }
        canvas.style.cursor = 'auto';
        context.beginPath();
        context.fillStyle = '#0c5705';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.closePath();
        shapes.forEach((shape, index) => {
            if (shape.isPointInCircle(mouseX, mouseY)) {
                canvas.style.cursor = 'grab';
            }
            shapes.forEach((otherBall, otherIndex) => {
                if (index !== otherIndex) {
                    shape.checkBallCollision(otherBall)
                }
            })
            shape.updatePosition();
            shape.draw();
        });
        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
}