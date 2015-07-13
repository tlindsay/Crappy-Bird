//   ____                             ____  _         _ 
//  / ___|_ __ __ _ _ __  _ __  _   _| __ )(_)_ __ __| |
// | |   | '__/ _` | '_ \| '_ \| | | |  _ \| | '__/ _` |
// | |___| | | (_| | |_) | |_) | |_| | |_) | | | | (_| |
//  \____|_|  \__,_| .__/| .__/ \__, |____/|_|_|  \__,_|
//                 |_|   |_|    |___/                   
////////////////////////////////////////////////////////////
// Adapted from Mary Rose Cook's Space Invaders:
// http://annotated-code.maryrosecook.com/space-invaders/
// 

;(function() {
	var Game = function() {
		console.info('Welcome to Crappy Bird');

		var self = this;

		var canvas = document.getElementById('crappy-bird');
		var screen = canvas.getContext('2d');
		var gameSize = { x: canvas.width, y: canvas.height };

		this.gameSize = gameSize;
		this.gameOver = false;

		this.bodies = [];

		this.bodies = this.bodies.concat(new Player(this, gameSize));

		var tick = function() {
			self.update();
			self.draw(screen, gameSize);
			if(self.gameOver === false)
				requestAnimationFrame(tick);
		};

		tick();
	};

	Game.prototype = {
		update : function() {
			this.bodies = this.bodies.filter(function(b) {
				return b.center.x > 0;
			});

			if(Math.random() >= 0.975){
				var pipe = new Pipe(this, Math.random() * 250);
				this.addBody(pipe);
			}

			for(var body in this.bodies) {
				if(!colliding(this.bodies[0], this.bodies[body]))
					this.bodies[body].update();
				else
					this.gameOver = true;
			}
		},

		draw : function(screen, gameSize) {
			screen.clearRect(0, 0, gameSize.x, gameSize.y);

			for(var body in this.bodies) {
				drawRect(screen, this.bodies[body]);
			}
		},

		addBody : function(body) {
			this.bodies.push(body);
		}
	};

	var Player = function (game, gameSize) {
		this.game = game;
		this.size = { x: 15, y: 15 };
		this.center = { x: gameSize.x / 2, y: gameSize.y / 2 };

		this.keyboarder = new Keyboarder();
	};

	Player.prototype = {
		update : function() {
			if(this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) && this.center.y > 0)
				this.center.y -= 15;
			else if(this.center.y <= this.game.gameSize.y - this.size.y)
				this.center.y += 5;
		}
	};

	var Pipe = function(game, height) {
		this.game = game;
		this.size = { x: 40, y: height };

		// The following code determines whether the pipe is a stalactite or a stalagmite.
		var topOrBottom = 0 + this.size.y / 2;

		if(Math.floor(Math.random() * 2) === 0 ){
			topOrBottom = this.game.gameSize.y - this.size.y / 2;
		}

		this.center = { x: this.game.gameSize.x, y: topOrBottom };

	};

	Pipe.prototype = {
		update : function() {
			this.center.x -= 3;
		}
	};

	var Keyboarder = function() {
		var keyState = {};

		window.addEventListener('keydown', function(e) {
			keyState[e.keyCode] = true;
		});

		window.addEventListener('keyup', function(e) {
			keyState[e.keyCode] = false;
		});

		this.isDown = function(keyCode) {
			return keyState[keyCode] === true;
		};

		this.KEYS = { SPACE: 32 };
	};

	var drawRect = function(screen, body) {
		screen.fillRect(body.center.x - body.size.x / 2,
						body.center.y - body.size.y / 2,
						body.size.x,
						body.size.y);
	};

	var colliding = function(b1, b2) {
		return !(
		  b1 === b2 ||
			b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
			b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
			b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
			b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
		);
	};

	window.addEventListener('load', function() {
		document.getElementById('crappy-bird').addEventListener('click', function() {
			new Game();
		});
	});
})();