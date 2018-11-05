function Particle(x, y, col, firework) {
	this.pos = createVector(x, y);
	this.firework = firework;
	this.lifespan = 255;
	this.col = col;

	if(this.firework) {
		this.vel = createVector(0, random(-14, -10));
		rocketSound.play();
	} else {
		this.vel = p5.Vector.random2D();
		this.vel.mult(random(2, 10));
	}
	this.acc = createVector(0, 0);

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.update = function() {
		if(!this.firework) {
			this.vel.mult(0.9);
			this.lifespan -= 5;
		}
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	this.done = function() {
		if(this.lifespan < 0) {
			return true;
		} else {
			return false;
		}
	}

	this.show = function() {
		if(!this.firework) {
			 strokeWeight(3);
			 stroke(this.col, this.lifespan);
		} else {
			strokeWeight(6);
			stroke(this.col);
		}
		point(this.pos.x, this.pos.y);
	}
}

function Firework() {
	this.firework = new Particle(random(width), height, color(255, 255, 255), true);
	this.exploded = false;
	this.particles = [];

	this.update = function() {
		if(!this.exploded) {
			this.firework.applyForce(gravity);
			this.firework.update();
			if(this.firework.vel.y >=0) {
				this.exploded = true;
				this.explode();
			}
		}
		for(var i=0; i<this.particles.length; i++) {
			// this.particles[i].applyForce(gravity);
			this.particles[i].update();
			if(this.particles[i].done()) {
				this.particles.splice(i, 1);
			}
		}
	}

	this.explode = function() {
		var col =  color(random(255), random(255), random(255));
		explosionSound.play();
		for(var i=0 ;i<100 ;i++) {
			var p = new Particle(this.firework.pos.x, this.firework.pos.y, col, false);
			this.particles.push(p);
		}
	}

	this.done = function() {
		if(this.exploded && this.particles.length === 0) {
			return true;
		}	else {
			return false;
		}
	}

	this.show = function() {
		if(!this.exploded) {
			this.firework.show();
		}
		for(var i=this.particles.length - 1 ; i>=0; i--) {
			this.particles[i].show();
		}
	}
}

var fireworks = [];
var gravity;
var rocketSound, explosionSound;
var roboto;

function preload() {
	rocketSound = loadSound("sounds/Bottle-Rocket.mp3");
	explosionSound = loadSound("sounds/Explosion.mp3");
	roboto = loadFont("fonts/Roboto/Roboto-Medium.ttf");
}

function setup() {
	createCanvas(windowWidth, windowHeight);							//windowWidth works over displayWidth
	gravity = createVector(0, 0.2);
	colorMode(RGB);
	stroke(255);
	strokeWeight(4);
	background(0);
	textAlign(CENTER);
	// textFont('Arial');
	textFont(roboto);
	// firework = new Particle(random(width), height);
}

function draw() {
	background(0, 25);
	fill(211, 84, 0);
	textSize(25);
	text('Wish you a very', windowWidth/2, windowHeight/3);
	textSize(35);
	text('HAPPY DIWALI', windowWidth/2, windowHeight/2)
	textSize(20);
	text('Suraj Jagtap', windowWidth/2 , (windowHeight*4)/5);
	if(random(1) < 0.03) {
		fireworks.push(new Firework());
	}
	for(var i=fireworks.length-1 ;i>=0; i--) {
		fireworks[i].update();
		fireworks[i].show();
		if(fireworks[i].done()) {
			fireworks.splice(i, 1);
		}
		// console.log(fireworks.length);
	}
	// var fps = frameRate();
	fill(255);
	stroke(0);
	// text("FPS: " + fps.toFixed(2), 10, height - 10);
}
