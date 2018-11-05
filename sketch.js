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
var senderName, from;

function preload() {
	rocketSound = loadSound("sounds/Bottle-Rocket.mp3");
	explosionSound = loadSound("sounds/Explosion.mp3");
	roboto = loadFont("fonts/Roboto/Roboto-Medium.ttf");
}

function setup() {
	senderName = getNameFromUrlVars();
	from = (senderName!== '') ? 'FROM' : '';
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
    text('Wish you a very', windowWidth/2, windowHeight/4);
    textSize(35);
    text('HAPPY DIWALI', windowWidth/2, windowHeight/2);
    textSize(20);
    text(from, windowWidth/2, (windowHeight*5)/8);
    textSize(30);
    text(senderName, windowWidth/2 , (windowHeight*6)/8);
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
	var fps = frameRate();
	fill(255);
	stroke(0);
	text("FPS: " + fps.toFixed(2), 10, height - 10);
}

// function redirect() {
// 	window.location.href = '/share.html';
// }

window.addEventListener('load', onLoad);

function handleCreateClick() {
	// alert('handlecreateclick: called');
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
	console.log(senderNameField);
	console.log(senderNameField.input_);
	senderNameField.input_.addEventListener('paste', function(evt) {
	  evt.preventDefault();
	});
	senderNameField.input_.addEventListener('input', function(evt) {
	  let x = evt.target.value;
	  let code = x.charCodeAt(x.length -1);
	  console.log(code);
	  if ((code >= 65 && code <= 90) || (code >=97 && code <= 122) || code == 32 || x.length >= 30) {
		window.senderNameText = evt.target.value;
	  } else {
		senderNameField.input_.value = evt.target.value.slice(0, -1);
		window.senderNameText = senderNameField.input_.value;
	  }
	});
	viewUrlButton.addEventListener('click', handleViewUrl);
	viewUrlButton.addEventListener('touchstart', handleViewUrl);
	// viewUrlButton.onclick = viewUrlButton.ontouchstart = function() {
	//   var rawInput = window.senderNameText.trim();
	//   window.senderNameText = rawInput.split(' ').join('-');
	//   window.createdUrl = `${window.location.origin}/?n=${window.senderNameText}`
	//   localStorage.setItem('shareUrl', window.createdUrl);
	//   dialog.close();
	//   createButton.style.display = "block";
	//   shareButton.style.display = "block";
	//   window.location.replace(window.createdUrl);
	// }
}

function onLoad() {
	mdc.ripple.MDCRipple.attachTo(document.querySelector('.create-button'));
	dialog = new mdc.dialog.MDCDialog(document.querySelector('.mdc-dialog'));
	createButton = document.querySelector('.create-button');
	shareButton = document.querySelector('.share-button');
	closeButton= document.querySelector('#close-button');

	// document.querySelector('#share-redirect').addEventListener('click', redirect);
	// document.querySelector('#share-redirect').addEventListener('touchstart', redirect);
	// document.querySelector('#share-redirect').addEventListener('touchend', redirect);

	createButton.addEventListener('click', handleCreateClick);
	createButton.addEventListener('touchstart', handleCreateClick);

	closeButton.addEventListener('click', handleCloseClick);
	closeButton.addEventListener('touchstart', handleCloseClick);
	closeButton.addEventListener('touchend', handleCloseClick);
}

function checkSupport() {
    try {
        if (typeof WebAssembly === "object"
            && typeof WebAssembly.instantiate === "function") {
            const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
            if (module instanceof WebAssembly.Module)
                return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
        }
    } catch (e) {
    }
    return false;
}

var is_supported = checkSupport();
if (is_supported === true) {
	gtag('event', 'support-check', {
		'event_category': 'webassembly',
		'event_label': 'is-supported',
		'value': 1,
	  });
} else {
	gtag('event', 'support-check', {
		'event_category': 'webassembly',
		'event_label': 'is-supported',
		'value': 0,
	  });
}
