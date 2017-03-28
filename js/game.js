var gameProperties = {
  screenWidth: 32,
  screenHeight: 32,

  dashSize: 2,
  paddleLeft_x: 1,
  paddleRight_x: 31,

  ballVelocity: 50,
  ballStartDelay: 2,
  ballRandomStartingAngleLeft: [-120, 120],
  ballRandomStartingAngleRight: [-60, 60],
};

var graphicsAssets = {
  ballURL: 'assets/ball.png',
  ballName: 'ball',

  paddleURL: 'assets/paddle.png',
  paddleName: 'paddle',
};

var mainState = function(game) {
  this.backgroundGraphics;
  this.ballSprite;
  this.paddleLeftSprite;
  this.paddleRightSprite;
}

mainState.prototype = {
  preload: function() {
    game.load.image(graphicsAssets.ballName, graphicsAssets.ballURL);
    game.load.image(graphicsAssets.paddleName, graphicsAssets.paddleURL);
  },

  create: function() {
    this.initGraphics();
    this.initPhysics();
    this.startDemo();
  },

  update: function() {

  },

  initPhysics: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.enable(this.ballSprite);

    this.ballSprite.checkWorldBounds = true;
    this.ballSprite.body.collideWorldBounds = true;
    this.ballSprite.body.immovable = true;
    this.ballSprite.body.bounce.set(1);
  },

  startDemo: function() {
    this.resetBall();
    this.enablePaddles(false);
    game.input.onDown.add(this.startGame, this);
  },

  startGame: function() {
    game.input.onDown.remove(this.startGame, this);

    this.enablePaddles(true);
  },

  resetBall: function() {
    this.ballSprite.reset(game.world.centerX, game.rnd.between(0, gameProperties.screenHeight));
    this.ballSprite.visible = false;
    game.time.events.add(Phaser.Timer.SECOND * gameProperties.ballStartDelay, this.startBall, this);

  },

  enablePaddles: function (enabled) {
    this.paddleLeftSprite.visible = enabled;
    this.paddleRightSprite.visible = enabled;
  },

  startBall: function() {
    this.ballSprite.visible = true

    var randomAngle = game.rnd.pick(gameProperties.ballRandomStartingAngleRight.concat(gameProperties.ballRandomStartingAngleLeft));

    game.physics.arcade.velocityFromAngle(randomAngle, gameProperties.ballVelocity, this.ballSprite.body.velocity);
  },

  initGraphics: function() {
    this.backgroundGraphics = game.add.graphics(0, 0);
    this.backgroundGraphics.lineStyle(1, 0xFFFFFF, 1);

    for (var y = 0; y < gameProperties.screenHeight; y += gameProperties.dashSize * 2) {
      this.backgroundGraphics.moveTo(game.world.centerX, y);
      this.backgroundGraphics.lineTo(game.world.centerX, y + gameProperties.dashSize);
    }

    this.ballSprite = game.add.sprite(game.world.centerX, game.world.centerY, graphicsAssets.ballName);
    this.ballSprite.anchor.set(0.5, 0.5);

    this.paddleLeftSprite = game.add.sprite(gameProperties.paddleLeft_x, game.world.centerY, graphicsAssets.paddleName);
    this.paddleLeftSprite.anchor.set(0.5, 0.5);

    this.paddleRightSprite = game.add.sprite(gameProperties.paddleRight_x, game.world.centerY, graphicsAssets.paddleName);
    this.paddleRightSprite.anchor.set(0.5, 0.5);
  },
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add('main', mainState);
game.state.start('main');
