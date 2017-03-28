var gameProperties = {
  screenWidth: 32,
  screenHeight: 32,

  dashSize: 2,
  paddleLeft_x: 1,
  paddleRight_x: 31,
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
};

mainState.prototype = {
  preload: function() {
    game.load.image(graphicsAssets.ballName, graphicsAssets.ballURL);
    game.load.image(graphicsAssets.paddleName, graphicsAssets.paddleURL);
  },

  create: function() {
    this.initGraphics();
  },

  update: function() {

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
