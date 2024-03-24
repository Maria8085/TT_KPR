import {lerp} from "../helpers/lerp.ts";

export type Color = string | CanvasGradient | CanvasPattern
export type Vector = [number, number]

export class Ball {
    private minSpeed: number = 0.005
    private context: CanvasRenderingContext2D
    public position: Vector = [0, 0]
    public target: Vector = [0, 0]
    public delta: Vector
    public color: Color = "#00CC00"
    public isGrabbed: boolean = false
    public isHovered: boolean = false

    public radius: number = 0;
    public mass: number = 0;
    private friction: number = 0.995
    private collisionTAX: number = 0.95
    private isSoundPlayed = false

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
        this.mass = (4 / 3) * Math.PI * Math.pow(radius / 10, 3);
        this.color = color ?? "#00CC00"
    }

    private playSound() {
        if (!this.isSoundPlayed) {
            this.isSoundPlayed = true
            const volume = Math.min(Math.sqrt(this.delta[0] ** 2 + this.delta[1] ** 2) / 10, 1)
            const sound = new Audio('/ballSaund.mp3');
            sound.loop = false;
            sound.volume = volume;
            sound.play();
            sound.addEventListener('ended', () => {
                this.isSoundPlayed = false
            })
        }
    }

    private checkWallCollision() {
        const width = this.context.canvas.width
        const height = this.context.canvas.height
        let isHit = false
        if (this.position[0] + this.radius > width) {
            this.position[0] = width - this.radius
            this.delta[0] = -this.delta[0];
            isHit = true
        } else if (this.position[0] - this.radius < 0) {
            this.position[0] = this.radius
            this.delta[0] = -this.delta[0];
            isHit = true
        }
        if (this.position[1] + this.radius > height) {
            this.position[1] = height - this.radius
            this.delta[1] = -this.delta[1]
            isHit = true
        } else if (this.position[1] - this.radius < 0) {
            this.position[1] = this.radius
            this.delta[1] = -this.delta[1]
            isHit = true
        }
        if (isHit) {
            this.playSound()
        }
    }

    updatePosition() {
        if (this.isGrabbed) {
            const x = lerp(0, this.target[0] - this.position[0], 0.5);
            const y = lerp(0, this.target[1] - this.position[1], 0.5);
            this.delta[0] = x
            this.delta[1] = y
        }
        this.position[0] += this.delta[0]
        this.position[1] += this.delta[1]

        // Проверка колизии со стенами
        this.checkWallCollision()

        // Эмуляция силы трения об поверхность стола
        this.delta[0] *= this.friction
        this.delta[1] *= this.friction

        // Остановка если скорость слишком мала
        if (Math.abs(this.delta[0]) < this.minSpeed) {
            this.delta[0] = 0
        }
        if (Math.abs(this.delta[1]) < this.minSpeed) {
            this.delta[1] = 0
        }
    }

    public checkBallCollision(ball: Ball) {
        let distance = Math.sqrt((this.position[0] - ball.position[0]) ** 2 + (this.position[1] - ball.position[1]) ** 2);
        if (distance == 0) {
            distance = 0.001;
        }
        let Dx = this.position[0] - ball.position[0];
        let Dy = this.position[1] - ball.position[1];
        let sin = Dx / distance;
        let cos = Dy / distance;
        if (distance < (this.radius + ball.radius)) {
            let Vn1 = ball.delta[0] * sin + ball.delta[1] * cos;
            let Vn2 = this.delta[0] * sin + this.delta[1] * cos;
            let dt = (ball.radius + this.radius - distance) / (Vn1 - Vn2);
            if (dt > 0.6) {
                dt = 0.6
            }
            if (dt < -0.6) {
                dt = -0.6
            }
            this.position[0] -= this.delta[0] * dt;
            this.position[1] -= this.delta[1] * dt;
            ball.position[0] -= ball.delta[0] * dt;
            ball.position[1] -= ball.delta[1] * dt;
            Dx = this.position[0] - ball.position[0];
            Dy = this.position[1] - ball.position[1];
            distance = Math.sqrt(Dx * Dx + Dy * Dy);
            if (distance == 0) distance = 0.01;
            sin = Dx / distance; // sin
            cos = Dy / distance; // cos
            Vn1 = ball.delta[0] * sin + ball.delta[1] * cos;
            Vn2 = this.delta[0] * sin + this.delta[1] * cos;
            const Vt1 = -ball.delta[0] * cos + ball.delta[1] * sin;
            const Vt2 = -this.delta[0] * cos + this.delta[1] * sin;

            const o = Vn2;
            Vn2 = Vn1;
            Vn1 = o;

            this.delta[0] = (Vn2 * sin - Vt2 * cos) * this.collisionTAX;
            this.delta[1] = (Vn2 * cos + Vt2 * sin) * this.collisionTAX;
            ball.delta[0] = (Vn1 * sin - Vt1 * cos) * this.collisionTAX;
            ball.delta[1] = (Vn1 * cos + Vt1 * sin) * this.collisionTAX;
            this.playSound()
        }

    }

    public isPointInCircle(x: number, y: number) {
        const distance = Math.sqrt((x - this.position[0]) ** 2 + (y - this.position[1]) ** 2);
        this.isHovered = distance < this.radius;
        return distance < this.radius;
    }

    private ballColor(): Color {
        if (this.isGrabbed) return '#ff0000'
        if (this.isHovered) return '#0000ff'
        return this.color
    }

    draw() {
        this.context.save();
        this.context.beginPath();
        this.context.shadowOffsetX = 5;
        this.context.shadowOffsetY = 5;
        this.context.shadowBlur = 10;
        this.context.shadowColor = "rgb(0 0 0 / 50%)";
        this.context.fillStyle = this.ballColor();
        this.context.strokeStyle = '#003300';
        this.context.arc(this.position[0], this.position[1], this.radius, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.lineWidth = 5;
        this.context.stroke();
        this.context.closePath();
        this.context.restore();
    }
}