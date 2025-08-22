const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const trailCanvas = document.getElementById('trail-canvas');
const trailCtx = trailCanvas.getContext('2d');
trailCanvas.width = window.innerWidth;
trailCanvas.height = window.innerHeight;

const G = 0.1;
const dt = 0.1;
const planets = [];
let sun;
let scale;
let simulationTime = 0;
const earthYearInSimTime = 232.7;

class Planet {
    constructor(x, y, mass, color, name, vx = 0, vy = 0) {
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.mass = mass;
        this.color = color;
        this.name = name;
        this.vx = vx;
        this.vy = vy;
        this.radius = Math.log(mass) * 1.5;
    }

    update() {
        this.prevX = this.x;
        this.prevY = this.y;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = `${12 / scale}px Arial`;
        ctx.fillText(this.name, this.x + this.radius + 5, this.y);
    }
}

function applyGravity() {
    planets.forEach(p => {
        const dx = sun.x - p.x;
        const dy = sun.y - p.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        const force = (G * sun.mass * p.mass) / distSq;

        const ax = (force * dx) / dist / p.mass;
        const ay = (force * dy) / dist / p.mass;

        p.vx += ax * dt;
        p.vy += ay * dt;
    });
}

function drawTrails() {
    trailCtx.lineWidth = 1 / scale;
    planets.forEach(p => {
        trailCtx.strokeStyle = p.color;
        trailCtx.beginPath();
        trailCtx.moveTo(p.prevX, p.prevY);
        trailCtx.lineTo(p.x, p.y);
        trailCtx.stroke();
    });
}

function drawStars() {
    for (let i = 0; i < 500; i++) {
        const x = Math.random() * trailCanvas.width;
        const y = Math.random() * trailCanvas.height;
        const radius = Math.random() * 1.5;
        const opacity = Math.random();

        trailCtx.beginPath();
        trailCtx.arc(x, y, radius, 0, Math.PI * 2);
        trailCtx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        trailCtx.fill();
    }
}

function setupSolarSystem() {
    sun = new Planet(0, 0, 20000, 'yellow', 'Sun');

    const mercuryDist = 60;
    const mercuryVel = Math.sqrt((G * sun.mass) / mercuryDist);
    const mercury = new Planet(mercuryDist, 0, 1, 'gray', 'Mercury', 0, -mercuryVel);
    planets.push(mercury);

    const venusDist = 90;
    const venusVel = Math.sqrt((G * sun.mass) / venusDist);
    const venus = new Planet(venusDist, 0, 5, 'orange', 'Venus', 0, -venusVel);
    planets.push(venus);

    const earthDist = 140;
    const earthVel = Math.sqrt((G * sun.mass) / earthDist);
    const earth = new Planet(earthDist, 0, 6, 'blue', 'Earth', 0, -earthVel);
    planets.push(earth);

    const marsDist = 200;
    const marsVel = Math.sqrt((G * sun.mass) / marsDist);
    const mars = new Planet(marsDist, 0, 3, 'red', 'Mars', 0, -marsVel);
    planets.push(mars);

    const jupiterDist = 350;
    const jupiterVel = Math.sqrt((G * sun.mass) / jupiterDist);
    const jupiter = new Planet(jupiterDist, 0, 600, 'brown', 'Jupiter', 0, -jupiterVel);
    planets.push(jupiter);

    const saturnDist = 500;
    const saturnVel = Math.sqrt((G * sun.mass) / saturnDist);
    const saturn = new Planet(saturnDist, 0, 450, 'tan', 'Saturn', 0, -saturnVel);
    planets.push(saturn);

    const uranusDist = 650;
    const uranusVel = Math.sqrt((G * sun.mass) / uranusDist);
    const uranus = new Planet(uranusDist, 0, 150, 'lightblue', 'Uranus', 0, -uranusVel);
    planets.push(uranus);

    const neptuneDist = 750;
    const neptuneVel = Math.sqrt((G * sun.mass) / neptuneDist);
    const neptune = new Planet(neptuneDist, 0, 130, 'darkblue', 'Neptune', 0, -neptuneVel);
    planets.push(neptune);

    const maxDist = neptuneDist + neptune.radius;
    scale = Math.min(canvas.width, canvas.height) / (2 * maxDist * 1.05);

    drawStars();

    trailCtx.translate(trailCanvas.width / 2, trailCanvas.height / 2);
    trailCtx.scale(scale, scale);
}

function animate() {
    requestAnimationFrame(animate);

    simulationTime += dt;
    const years = (simulationTime / earthYearInSimTime).toFixed(2);
    document.getElementById('time-counter').textContent = `Time: ${years} Earth Years`;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);

    sun.draw();
    applyGravity();
    planets.forEach(p => {
        p.update();
        p.draw();
    });
    drawTrails();

    ctx.restore();
}

setupSolarSystem();
animate();