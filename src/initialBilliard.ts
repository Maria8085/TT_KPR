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