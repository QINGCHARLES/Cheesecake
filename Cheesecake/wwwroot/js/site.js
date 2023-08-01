var countdown;
var minutes = 1;
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
		if (guess === this.chest) { view.displayChest(guess); return; }
		if (guess === this.mermaid) { view.displayMermaid(guess); return; }
		if (guess === this.monster) { view.displayMonster(guess); return; }

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
