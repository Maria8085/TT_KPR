import { Circle } from "./components/Circle";



export function initialCanvas(canvas: HTMLCanvasElement){
    const context = canvas.getContext('2d');
    const shapes = [
        new Circle(100,100,50, "#ff00ff"),
        new Circle(350,200,100),
    ] 
    function draw(){
        if(!context){
            return null;
        }
        context.beginPath();
        context.fillStyle = '#0c5705';
        context.fillRect(0, 0, canvas.width, canvas.height); 
        context.closePath();
        shapes.forEach(shape=>{
            shape.draw(context);
        });
        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
}