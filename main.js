let canvas = document.querySelector("#mycanvas");
let ctx = canvas.getContext("2d");

let pos = { x: 40, y: 40 };

let vel = { x: 4, y: 5 };
let r = 20;

function randInt(min, max){
    return Math.round(Math.random()*(max - min) + min);
}

class Moon {
    constructor(position, r, angle, col){
        this.pos = position;
        this.r = r;
        this.angle = angle;
        this.color = col;
        this.stretchFactor = 0.65; //The smaller the number, the less "deep" the moon will be.
        //Old version not using translate
        this.cp1 = {x: this.pos.x - this.r, y: this.pos.y + 0.65*this.r};
        this.cp2 = {x: this.pos.x + this.r, y: this.pos.y + 0.65*this.r};

        //new version using translate (using relative values - needed to support rotate)
        this.cp1 = {x: -this.r, y: 0.65*this.r};
        this.cp2 = {x: this.r, y: 0.65*this.r};
        
    }

    render(){
        ctx.save();
        
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(0, 0, this.r, 0, Math.PI);
        ctx.bezierCurveTo(this.cp1.x, this.cp1.y, this.cp2.x, this.cp2.y, this.r, 0);
        ctx.fill();
    
        ctx.restore();
    }

    update(){
        
    }
}

class EtsiLogo{
    constructor(x, y, r){
        this.x = x;
        this.y = y;
        this.r = r;
        this.colors = ["#62cbe2", "#337fc2", "#704fa0", "#9c59a4", "#ea367a"];
        this.init();
        this.delta = 0;
        this.closer = 20;
    }

    init(){
        this.moons = [];
        this.dots = [];
        for (let i = 0; i < 5; i++){
            let angle = (2*Math.PI)/5*i;
            let x = this.x + Math.cos(angle) * this.r;
            let y = this.y + Math.sin(angle) * this.r;
            this.dots.push({x: x, y: y});
            this.moons.push(new Moon({x: x - Math.cos(angle)*this.closer, y: y - Math.sin(angle)*this.closer}, this.r*2, angle - Math.PI/4, this.colors[i]));
        }
    }

    update(){
        this.delta += 0.01;
        for (let i = 0; i < 5; i++){
            let angle = (2*Math.PI)/5*i + this.delta;
            let x = this.x + Math.cos(angle) * this.r;
            let y = this.y + Math.sin(angle) * this.r;
            this.dots[i] = ({x: x, y: y});
            this.moons[i].pos.x = x - Math.cos(angle + this.delta*5)/4*this.closer;
            this.moons[i].pos.y =  y - Math.sin(angle + this.delta*5)/4*this.closer; 
            this.moons[i].angle = angle - Math.PI/4;
        }
    }

    render(){
        for (let dot of this.dots){
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 5, 0, 2*Math.PI);
            ctx.fillStyle = "black";
            ctx.fill();
        }

        for (let moon of this.moons){
            moon.render();
        }
    }
}

let moon = new Moon({x: 200, y: 200}, 50, Math.PI/2, "rgb(200, 90, 90)");
let logo = new EtsiLogo(200, 300, 40);
function render() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    //background
    ctx.fillStyle = "white";//"#edd5a1";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    //moon.render();
    logo.render();

}

function update() {
    logo.update();

}

function gameLoop() {
    requestAnimationFrame(gameLoop);

    update();
    render();

}

gameLoop();