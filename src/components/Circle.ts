export type Color = string | CanvasGradient | CanvasPattern
export class Circle {
    public x: number = 0;
    public y: number = 0;

    public color:Color = "#00CC00"

    public radius: number = 0;
    public mass: number = 0;

    constructor(x: number,y: number, radius: number, color?: Color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.mass = (4/3) * Math.PI * Math.pow(radius, 3);
        this.color = color??"#00CC00"
    }

    draw(context: CanvasRenderingContext2D){
        const currentColor = context.fillStyle
        context.beginPath();
        context.fillStyle = this.color;
        context.strokeStyle = '#003300';
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fill();
        context.lineWidth = 5;
        context.stroke();
        context.closePath();

        this.x = this.x +1;

        context.fillStyle = currentColor;
    }
}