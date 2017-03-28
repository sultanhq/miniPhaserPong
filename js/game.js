var gameProperties = {
  screenWidth: 32,
  screenHeight: 32,
};

var graphicsAssets = {
  ballURL: 'assets/ball.png',
  ballName: 'ball',

  paddleURL: 'assets/paddle.png',
  paddlename: 'paddle',
};

var mainState = function(game) {};
mainState.prototype = {
  preload: function() {
    game.load.image(graphicsAssets.ballName, graphicsAssets.ballURL);
    game.load.image(graphicsAssets.paddleName, graphicsAssets.paddleURL);
  },

  create: function() {

  },

  update: function() {

  },
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add('main', mainState);
game.state.start('main');
