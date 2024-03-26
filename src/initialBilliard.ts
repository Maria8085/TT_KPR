import {Ball} from "./components/Ball.ts";

export type CustomEventType = {
    e: MouseEvent,
    ball: Ball | null
}

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
            context, position: [225, 350], color: '#fff', radius: Math.random() * 50 + 30, delta: [0, 0]
        }),
        new Ball({
            context,
            position: [600, 350],
            radius: Math.random() * 50 + 30,
            color: "#f80000",
            delta: [0, 0]
        }),
        new Ball({
            context,
            position: [750, 450],
            radius: Math.random() * 50 + 30,
            color: "#fefe22",
            delta: [0, 0]
        }),
        new Ball({
            context,
            position: [750, 250],
            radius: Math.random() * 50 + 30,
            color: "#0000cc",
            delta: [0, 0]
        }),
        new Ball({
            context,
            position: [900, 150],
            radius: Math.random() * 50 + 30,
            color: "#ff00ff",
            delta: [0, 0]
        }),
        new Ball({
            context,
            position: [900, 350],
            radius: Math.random() * 50 + 30,
            color: "#00ff00",
            delta: [0, 0]
        }),
        new Ball({
            context,
            position: [900, 550],
            radius: Math.random() * 50 + 30,
            color: "#00ffdd",
            delta: [0, 0]
        })
    ]

    canvas.addEventListener('mousedown', (e) => {
        console.log(e.button)
        // Check if mouse is over a ball
        let ballIsHovered = false
        if (e.button === 0) {
            shapes.forEach((ball) => {
                if (ball.isHovered) {
                    ballIsHovered = true
                    ball.target = [mouseX, mouseY]
                    ball.isGrabbed = true
                    grabbedBall = ball
                }
            })
        }
        if (!ballIsHovered) {
            const event = new CustomEvent<CustomEventType>("clickBall", {
                detail: {
                    e,
                    ball: null,
                }
            });
            document.dispatchEvent(event);
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        if (grabbedBall) {
            grabbedBall.target = [mouseX, mouseY]
        }
    });

    document.addEventListener('mouseup', () => {
        if (grabbedBall) {
            grabbedBall.isGrabbed = false;
            grabbedBall = null;
        }
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        let ballIsClicked = false
        shapes.forEach((ball) => {
            if (ball.isHovered) {
                ballIsClicked = true
                const event = new CustomEvent<CustomEventType>("clickBall", {
                    detail: {
                        e,
                        ball,
                    }
                });
                document.dispatchEvent(event);
            }
        })
        if (!ballIsClicked) {
            const event = new CustomEvent<CustomEventType>("clickBall", {
                detail: {
                    e,
                    ball: null,
                }
            });
            document.dispatchEvent(event);
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
        shapes.forEach((ball, index) => {
            if (ball.isPointInCircle(mouseX, mouseY)) {
                canvas.style.cursor = 'grab';
            }
            shapes.forEach((otherBall, otherIndex) => {
                if (index !== otherIndex) {
                    ball.checkBallCollision(otherBall)
                }
            })
            ball.updatePosition();
            ball.draw();
        });
        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
}