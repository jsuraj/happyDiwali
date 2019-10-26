var createButton, dialog, shareButton;
var senderNameField, viewUrlButton, closeButton;

function getNameFromUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	let name = (Object.keys(vars).length > 0 && vars.n !== undefined) ? vars.n.split('-').join(' ') : '';
	return name;
  }

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
	var col =  color(random(255), random(255), random(255));
	this.firework = new Particle(random(width), height, col, true);
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
		// var col =  color(random(255), random(255), random(255));
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
var senderName, from;
var finalWidth, finalHeight;

function preload() {
	rocketSound = loadSound("sounds/Bottle-Rocket.mp3");
	explosionSound = loadSound("sounds/Explosion.mp3");
	roboto = loadFont("fonts/Baloo_Bhaina/BalooBhaina-Regular.ttf");
	cookie = loadFont("fonts/Cookie/Cookie-Regular.ttf");
}

function setup() {
	senderName = getNameFromUrlVars();
	from = (senderName!== '') ? 'From:' : '';
	createCanvas(windowWidth, windowHeight);							//windowWidth works over displayWidth
	gravity = createVector(0, 0.2);
	colorMode(RGB);
	stroke(255);
	strokeWeight(4);
	background(0);
	textAlign(CENTER);
	// textFont('Arial');
	finalWidth = windowWidth;
	finalHeight = windowHeight;
	textFont(roboto);
	// firework = new Particle(random(width), height);
}

function windowResized() {
	setup();
	resizeCanvas(windowWidth, windowHeight);
  }

function draw() {
	background(0, 25);
	drawLights();
	fill(211, 84, 0);
	textFont(roboto)
    text('Wish you a very', finalWidth/2, finalHeight/4);
    textSize(35);
    text('HAPPY DIWALI', finalWidth/2, finalHeight/2);
    textSize(20);
    text(from, finalWidth/2, (finalHeight*5)/8);
	textSize(30);
	textFont(cookie);
	fill(255, 215, 0);
    text(senderName, finalWidth/2 , (finalHeight*6)/8);
	if(random(1) < 0.03) {
		fireworks.push(new Firework());
	}
	for(var i=fireworks.length-1 ;i>=0; i--) {
		fireworks[i].update();
		fireworks[i].show();
		if(fireworks[i].done()) {
			fireworks.splice(i, 1);
		}
	}
	// var fps = frameRate();
	fill(255);
	// stroke(0);
	// text("FPS: " + fps.toFixed(2), 10, height - 10);
}


window.addEventListener('load', onLoad);

function drawLights() {
	strokeWeight(1);
	noFill();
	stroke(254,216,177);
	let x1 = 0,
		x2 = windowWidth/6,
		x3 = 2*windowWidth/6,
		x4 = windowWidth/2;
	let y1 = 0,
		y2 = windowHeight/8,
		y3 = windowHeight/8,
		y4 = 0;
	let a1 = windowWidth/2,
		a2 = 4*windowWidth/6,
		a3 = 5*windowWidth/6,
		a4 = windowWidth;
	let b1 = 0,
		b2 = windowHeight/8,
		b3 = windowHeight/8,
		b4 = 0;		
	bezier(x1, y1, x2, y2, x3, y3, x4, y4);
	bezier(a1, b1, a2, b2, a3, b3, a4, b4);
	let steps = 15;
	for (let i = 0; i <= steps; i++) {
		let t = i / steps;
		let x = bezierPoint(x1, x2, x3, x4, t);
		let y = bezierPoint(y1, y2, y3, y4, t);
		let a = bezierPoint(a1, a2, a3, a4, t);
		let b = bezierPoint(b1, b2, b3, b4, t);
		stroke(255, 215, 0);
		let val = random([0, 1]);
		if(val == 1) {
			fill(255, 215, 0);
		} else {
			fill(0, 0, 0);
		}
		ellipse(x, y, 5, 5);
		ellipse(a, b, 5, 5);
	}
	// bezier(windowWidth/2, 0, 4*windowWidth/6, windowHeight/8, 5*windowWidth/6, windowHeight/8, windowWidth, 0);
	// curve(5, 26, 5, 26, 73, 24, 73, 61);
	noStroke();
}

function handleCreateClick() {
	createButton.style.display = "none";
	shareButton.style.display = "none";
	dialog.open();
	senderNameField = new mdc.textField.MDCTextField(document.querySelector('#senderName'));
	viewUrlButton = document.querySelector('#view-url-button');
	addListeners(senderNameField, viewUrlButton);
}

function handleCloseClick() {
	dialog.close();
	createButton.style.display = "block";
	shareButton.style.display = "block";
}

function handleViewUrl() {
	var rawInput = window.senderNameText.trim();
	window.senderNameText = rawInput.split(' ').join('-');
	window.createdUrl = `${window.location.origin}/?n=${window.senderNameText}`
	localStorage.setItem('shareUrl', window.createdUrl);
	localStorage.setItem('senderName', window.senderNameText);
	dialog.close();
	createButton.style.display = "block";
	shareButton.style.display = "block";
	window.location.replace(window.createdUrl);
}

function addListeners(senderNameField, viewUrlButton) {
	senderNameField.input_.addEventListener('paste', function(evt) {
	  evt.preventDefault();
	});
	senderNameField.input_.addEventListener('input', function(evt) {
	  let x = evt.target.value;
	  let code = x.charCodeAt(x.length -1);
	  if ((code >= 65 && code <= 90) || (code >=97 && code <= 122) || code == 32 || x.length >= 30) {
		window.senderNameText = evt.target.value;
	  } else {
		senderNameField.input_.value = evt.target.value.slice(0, -1);
		window.senderNameText = senderNameField.input_.value;
	  }
	});
	viewUrlButton.addEventListener('click', handleViewUrl);
	viewUrlButton.addEventListener('touchstart', handleViewUrl);
}

function onLoad() {
	mdc.ripple.MDCRipple.attachTo(document.querySelector('.create-button'));
	dialog = new mdc.dialog.MDCDialog(document.querySelector('.mdc-dialog'));
	createButton = document.querySelector('.create-button');
	shareButton = document.querySelector('.share-button');
	closeButton= document.querySelector('#close-button');

	createButton.addEventListener('click', handleCreateClick);
	createButton.addEventListener('touchstart', handleCreateClick);

	closeButton.addEventListener('click', handleCloseClick);
	closeButton.addEventListener('touchstart', handleCloseClick);
	closeButton.addEventListener('touchend', handleCloseClick);
}

