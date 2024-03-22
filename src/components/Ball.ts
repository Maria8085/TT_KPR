export type Color = string | CanvasGradient | CanvasPattern
export type Vector = [number, number]

export class Ball {
    private minSpeed: number = 0.005
    private context: CanvasRenderingContext2D
    public position: Vector = [0, 0]
    public delta: Vector
    public color: Color = "#00CC00"

    public radius: number = 0;
    public mass: number = 0;
    private friction: number = 0.999

    constructor({context, position, radius, color, delta}: {
        context: CanvasRenderingContext2D,
        position: Vector,
        radius: number,
        color?: Color
        delta?: Vector
    }) {
        this.context = context;
        this.delta = delta ?? [Math.random() % 10, Math.random() % 10];
        this.position = position;
        this.radius = radius;
        this.mass = (4 / 3) * Math.PI * Math.pow(radius/10, 3);
        this.color = color ?? "#00CC00"
    }

    private checkWallCollision() {
        const width = this.context.canvas.width
        const height = this.context.canvas.height
        if (this.position[0] + this.radius > width) {
            this.position[0] = width - this.radius
            this.delta[0] = -this.delta[0];
        } else if (this.position[0] - this.radius < 0) {
            this.position[0] = this.radius
            this.delta[0] = -this.delta[0];
        }
        if (this.position[1] + this.radius > height) {
            this.position[1] = height - this.radius
            this.delta[1] = -this.delta[1]
        } else if (this.position[1] - this.radius < 0) {
            this.position[1] = this.radius
            this.delta[1] = -this.delta[1]
        }
    }

    updatePosition() {
        this.position[0] += this.delta[0]
        this.position[1] += this.delta[1]
        this.checkWallCollision()

        this.delta[0] *= this.friction
        this.delta[1] *= this.friction

        if(Math.abs(this.delta[0])<this.minSpeed){
            this.delta[0] = 0
        }
        if(Math.abs(this.delta[1])<this.minSpeed){
            this.delta[1] = 0
        }
    }

    public checkBallCollision(ball: Ball) {

        const distance = Math.sqrt(
            (this.position[0] - ball.position[0]) **  2 + (this.position[1] - ball.position[1]) ** 2
    );
        if (distance < (this.radius + ball.radius)) {
            this.delta[0] = -this.delta[0];
            this.delta[1] = -this.delta[1];
            // ball.delta[0] = -ball.delta[0];
            // ball.delta[1] = -ball.delta[1];
            this.color = "#ff0000"
        }else{
            this.color = "#00ff00"
        }
    }

    draw() {
        const currentColor = this.context.fillStyle
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.strokeStyle = '#003300';
        this.context.arc(this.position[0], this.position[1], this.radius, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.lineWidth = 5;
        this.context.stroke();
        this.context.closePath();
        this.context.fillStyle = currentColor;
    }
}