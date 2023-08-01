var countdown;
var minutes = 10;
var seconds = 0;

function startCountdown()
{
	clearInterval(countdown); // clear any existing interval

	countdown = setInterval(function ()
	{
		seconds--;
		if (seconds < 0)
		{
			seconds = 59;
			minutes--;
		}

		if (minutes < 0)
		{
			clearInterval(countdown);
			document.getElementById("timer").innerHTML = "⏳00:00";
		} else
		{
			document.getElementById("timer").innerHTML = "⏳" + (minutes < 10 ? "0" : "") + minutes.toString() + ":" + (seconds < 10 ? "0" : "") + seconds.toString();

			if (minutes < 1)
			{
				document.getElementById("timer").className = "alarm";
			}
			else
			{
				document.getElementById("timer").className = "";
			}
		}
	}, 1000);
}

// Start countdown when page loads
startCountdown();

document.addEventListener('click', function (event)
{
	var comet = document.createElement('div');
	comet.className = 'comet';
	comet.textContent = '☄️'; // comet emoji
	comet.style.top = event.clientY + 'px';
	comet.style.left = event.clientX + 'px';
	document.body.appendChild(comet);

	comet.addEventListener('animationend', function ()
	{
		comet.parentNode.removeChild(comet);
	});
});

const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI * 0.5;

// canvas settings
var viewWidth = 512,
	viewHeight = 550,
	drawingCanvas = document.getElementById("drawing_canvas"),
	ctx,
	timeStep = (1 / 60);

Point = function (x, y)
{
	this.x = x || 0;
	this.y = y || 0;
};

Particle = function (p0, p1, p2, p3)
{
	this.p0 = p0;
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;

	this.time = 0;
	this.duration = 3 + Math.random() * 2;
	this.color = '#' + Math.floor((Math.random() * 0xffffff)).toString(16);

	this.w = 8;
	this.h = 6;

	this.complete = false;
};

Particle.prototype = {
	update: function ()
	{
		this.time = Math.min(this.duration, this.time + timeStep);

		var f = Ease.outCubic(this.time, 0, 1, this.duration);
		var p = cubeBezier(this.p0, this.p1, this.p2, this.p3, f);

		var dx = p.x - this.x;
		var dy = p.y - this.y;

		this.r = Math.atan2(dy, dx) + HALF_PI;
		this.sy = Math.sin(Math.PI * f * 10);
		this.x = p.x;
		this.y = p.y;

		this.complete = this.time === (this.duration);
	},
	draw: function ()
	{
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.r);
		ctx.scale(1, this.sy);

		ctx.fillStyle = this.color;
		ctx.fillRect(-this.w * 3.5, -this.h * 0.5, this.w, this.h);

		ctx.restore();
	}
};

var particles = [];

function initDrawingCanvas()
{
	drawingCanvas.width = viewWidth;
	drawingCanvas.height = viewHeight;
	ctx = drawingCanvas.getContext('2d');
	createParticles();
}

function createParticles()
{
	for (var i = 0; i < 128; i++)
	{
		var p0 = new Point(viewWidth * 0.5, viewHeight * 0.5);
		var p1 = new Point(Math.random() * viewWidth, Math.random() * viewHeight);
		var p2 = new Point(Math.random() * viewWidth, Math.random() * viewHeight);
		var p3 = new Point(Math.random() * viewWidth, viewHeight + 64);

		particles.push(new Particle(p0, p1, p2, p3));
	}
}

function update()
{

	particles.forEach(function (p)
	{
		p.update();
	});
}

function draw()
{
	ctx.clearRect(0, 0, viewWidth, viewHeight);


	particles.forEach(function (p)
	{
		p.draw();
	});
}

function shootConfetti()
{
	particles = [];
	initDrawingCanvas();

	requestAnimationFrame(loop);
};

function loop()
{
	update();
	draw();


	if (checkParticlesComplete())
	{
		particles = [];
		particles.length = 0;
		//createParticles();
		return;
	}

	requestAnimationFrame(loop);
}

function checkParticlesComplete()
{
	for (var i = 0; i < particles.length; i++)
	{
		if (particles[i].complete === false) return false;
	}
	return true;
}

// math and stuff

/**
 * easing equations from http://gizma.com/easing/
 * t = current time
 * b = start value
 * c = delta value
 * d = duration
 */
var Ease = {
	inCubic: function (t, b, c, d)
	{
		t /= d;
		return c * t * t * t + b;
	},
	outCubic: function (t, b, c, d)
	{
		t /= d;
		t--;
		return c * (t * t * t + 1) + b;
	},
	inOutCubic: function (t, b, c, d)
	{
		t /= d / 2;
		if (t < 1) return c / 2 * t * t * t + b;
		t -= 2;
		return c / 2 * (t * t * t + 2) + b;
	},
	inBack: function (t, b, c, d, s)
	{
		s = s || 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	}
};

function cubeBezier(p0, c0, c1, p1, t)
{
	var p = new Point();
	var nt = (1 - t);

	p.x = nt * nt * nt * p0.x + 3 * nt * nt * t * c0.x + 3 * nt * t * t * c1.x + t * t * t * p1.x;
	p.y = nt * nt * nt * p0.y + 3 * nt * nt * t * c0.y + 3 * nt * t * t * c1.y + t * t * t * p1.y;

	return p;
}

function delayOneSecond()
{
	return new Promise(resolve => setTimeout(resolve, 1000));
}

var model = {
	boardSize: 10,
	numShips: 5,
	shipLength: 3,
	shipsSunk: 0,
	chest: "",
	mermaid: "",
	monster: "",

	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

	fire: function (guess)
	{
		if (guess === this.chest) { view.displayChest(guess); shootConfetti(); return; }
		if (guess === this.mermaid) { view.displayMermaid(guess); shootConfetti(); return; }
		if (guess === this.monster) { view.displayMonster(guess); shootConfetti(); return; }

		for (var i = 0; i < this.numShips; i++)
		{
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess); // przesukuje tablice w celu znalezienia guess i zwraca indeks
			if (ship.hits[index] === "hit")
			{
				view.displayMessage("You hit this ship before.");
				return true;
			} else if (index >= 0)
			{
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("It's a hit!");
				if (this.isSunk(ship))
				{
					view.displayMessage("You sunk my battleship!");
					view.displaySunk(ship);
					this.shipsSunk++;
					shootConfetti();
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("It's a miss!");
		return false;
	},

	isSunk: function (ship)
	{
		for (i = 0; i < this.shipLength; i++)
		{
			if (ship.hits[i] !== "hit")
			{
				return false;
			}
		}

		return true;
	},

	generateShipLocations: function ()
	{
		var locations;
		for (var i = 0; i < this.numShips; i++)
		{
			do
			{
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}

		do
		{
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * this.boardSize);
			locations = [row + "" + col];
			this.chest = row + "" + col;
		} while (this.collision(locations));

		do
		{
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * this.boardSize);
			locations = [row + "" + col];
			this.mermaid = row + "" + col;
		} while (this.collision(locations) || locations == this.chest );

		do
		{
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * this.boardSize);
			locations = [row + "" + col];
			this.monster = row + "" + col;
		} while (this.collision(locations) || locations == this.chest || locations == this.mermaid);

		//alert(this.chest + " " + this.mermaid + " " + this.monster);

		console.log("Generating ships: ");
		console.log(this.ships);
	},

	generateShip: function ()
	{
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1)
		{  // horiz
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else
		{ // vert
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++)
		{
			if (direction === 1)
			{
				newShipLocations.push(row + "" + (col + i));
			} else
			{
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function (locations)
	{
		for (var i = 0; i < this.numShips; i++)
		{
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++)
			{
				if (ship.locations.indexOf(locations[j]) >= 0)
				{
					return true;
				}
			}
		}
		return false;
	}

};

var view = {
	displayMessage: function (msg)
	{
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function (location)
	{
		var cell = document.getElementById(location);
		cell.parentElement.style.border = "none";
		cell.innerText = "🚢";
		cell.setAttribute("class", "hitb");

	},

	displayChest: function (location)
	{
		var cell = document.getElementById(location);
		cell.parentElement.style.border = "none";
		cell.innerText = "🏆";
		cell.setAttribute("class", "hitb");
	},

	displayMermaid: function (location)
	{
		var cell = document.getElementById(location);
		cell.parentElement.style.border = "none";
		cell.innerText = "🧜‍";
		cell.setAttribute("class", "hitb hitmer");
	},

	displayMonster: function (location)
	{
		var cell = document.getElementById(location);
		cell.parentElement.style.border = "none";
		cell.innerText = "🦑";
		cell.setAttribute("class", "hitb");
	},

	displaySunk: function (ship)
	{
		for (i = 0; i < ship.locations.length; i++)
		{
			var cell = document.getElementById(ship.locations[i]);
			cell.innerText = "💥";
		}
	},

	displayMiss: function (location)
	{
		var cell = document.getElementById(location);
		cell.innerText = "💥";
		cell.parentElement.style.border = "none";
		cell.innerText = "🌊";
		cell.setAttribute("class", "missb");
	}
};

var controller = {
	guesses: 0,
	processGuess: function (location)
	{
		if (location)
		{
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips)
			{
				view.displayMessage("You sunk all of my battleships in " + this.guesses + " tries.");
				var end = document.getElementById("guessInput").disabled = true;
			}
		}
	}
}

window.onload = init;

function init()
{

	var guessClick = document.getElementsByTagName("td");
	for (var i = 0; i < guessClick.length; i++)
	{
		guessClick[i].onclick = answer;
	}

	model.generateShipLocations();
	view.displayMessage("Hello, let's play! There are 3 ships, each 3 cells long");
}

function answer(eventObj)
{
	var shot = eventObj.target;
	var location = shot.id;
	delayOneSecond().then(() => controller.processGuess(location));
}
