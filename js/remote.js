var remoteProperties = {
  screenWidth: 300,
  screenHeight: 300,
}

var left = false;
var right = false;
var paddle_up = false;
var paddle_down = false;
var paddle_choice;
var playerID;

var scores = ["0", "0"];
var gameWinner;

var ready = false;

var socket = io();

var fontAssets = {

  scoreLeft_x: remoteProperties.screenWidth * 0.25,
  scoreRight_x: remoteProperties.screenWidth * 0.75,
  scoreTop_y: remoteProperties.screenHeight - 75,

  fontStyle: {
    font: '22px monospace',
    fill: '#FFFFFF',
    align: 'center'
  },

  redFontStyle: {
    font: '50px monospace',
    fill: '#FF0000',
    align: 'center'
  },

  greenFontStyle: {
    font: '50px monospace',
    fill: '#00FF00',
    align: 'center'
  },
};


var mainState = function(remote) {
  this.backgroundGraphics;
  this.title;

  this.selectLeftPaddle;
  this.selectRightPaddle;

  this.button_up;
  this.button_down;

  this.scoreLeft = '0';
  this.scoreRight = '0';
  this.tf_scoreLeft;
  this.tf_scoreRight;
  this.startGame;
}

mainState.prototype = {
  preload: function() {
    remote.stage.disableVisibilityChange = true;
    remote.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

    remote.load.image('leftButton', 'assets/left.png');
    remote.load.image('rightButton', 'assets/right.png');
    remote.load.image('LUpButton', 'assets/lUp.png');
    remote.load.image('LDownButton', 'assets/lDown.png');
    remote.load.image('RUpButton', 'assets/rUp.png');
    remote.load.image('RDownButton', 'assets/rDown.png');
    remote.load.image('restart', 'assets/restart.png');
  },

  create: function() {
    console.log(socket.id);
    this.createTitle();
    this.createSocketListeners();
    this.createPaddleChoiceButtons();
    this.createScoreBoard();
  },

  update: function() {
    this.checkForChoice();
    this.checkForControl();
  },

  gameOver: function(data){
    gameWinner = data;
    this.gameOverGraphics();
    this.gameOverSettings();
    socket.close()
  },

  checkForSpace: function(side) {
    if (!socket.connected) {
      socket.connect()
    }
    socket.emit('check', {
      id: socket.id,
      side: side,
    });
  },

  gameOverGraphics: function() {
    this.title.text = gameWinner + ' Wins!';
    this.button_up.visible = false;
    this.button_down.visible = false;
    startGame = remote.add.button(remote.world.centerX, remote.world.centerY, 'restart');
    startGame.anchor.set(0.5, 0.5);
    startGame.visible = true;
  },

  gameOverSettings: function() {
    left = false;
    right = false;
    startGame.onInputDown.add(this.startNewGame, this);
  },

  startNewGame: function() {
    socket.emit('connect')
    socket.emit('newGame')
    ready = false;
    this.tf_scoreLeft.text = 0;
    this.tf_scoreRight.text = 0;
    startGame.onInputDown.remove(this.startNewGame, this);
    startGame.visible = false;
    this.createPaddleChoiceButtons();
  },

  createSocketListeners: function() {
    // socket.on('available', function(data) {
    //   console.log(data)
    // });
    socket.on('score', function(data) {
      this.updateScores(data);
    }.bind(this));
    socket.on('winner', function(data) {
      this.gameOver(data);
    }.bind(this));
  },

  checkForChoice: function() {
    if (!ready) {
      if (left) {
        paddleChoice = 'L';
        this.checkForSpace(paddleChoice);
        this.createPaddleButtons();
      } else if (right) {
        paddleChoice = 'R';
        this.checkForSpace(paddleChoice);
        this.createPaddleButtons();
      } else return;
    }
  },

  checkForControl: function() {
    if (paddle_up) {
      socket.emit(paddleChoice + 'control message', 'up');
    } else if (paddle_down) {
      socket.emit(paddleChoice + 'control message', 'down');
    }
  },

  updateScores: function(data) {
    scores = data.score.split(',')
    if (ready) {
      this.scoreLeft = scores[0]
      this.scoreRight = scores[1]
      this.tf_scoreLeft.text = this.scoreLeft;
      this.tf_scoreRight.text = this.scoreRight;
    };
  },

  createPaddleChoiceButtons: function() {
    selectLeftPaddle = remote.add.button(remoteProperties.screenWidth * 0.25, remote.world.centerY, 'leftButton');
    selectLeftPaddle.anchor.set(0.5, 0.5);
    selectLeftPaddle.onInputDown.add(actionOnLeftClick, this);

    selectRightPaddle = remote.add.button(remoteProperties.screenWidth * 0.75, remote.world.centerY, 'rightButton');
    selectRightPaddle.anchor.set(0.5, 0.5);
    selectRightPaddle.onInputDown.add(actionOnRightClick, this);
  },

  createPaddleButtons: function() {
    if (paddleChoice ==== 'L') {
      this.button_up = remote.add.button(remoteProperties.screenWidth * 0.25, remote.world.centerY * 0.5, 'LUpButton');
      this.button_down = remote.add.button(remoteProperties.screenWidth * 0.25, remote.world.centerY, 'LDownButton');
    } else if (paddleChoice ==== 'R') {
      this.button_up = remote.add.button(remoteProperties.screenWidth * 0.75, remote.world.centerY * 0.5, 'RUpButton');
      this.button_down = remote.add.button(remoteProperties.screenWidth * 0.75, remote.world.centerY, 'RDownButton');
    }
    this.button_up.anchor.set(0.5, 0.5);
    this.button_down.anchor.set(0.5, 0.5);
    this.button_up.onInputDown.add(actionOnUpClick, this);
    this.button_up.onInputUp.add(actionOnUpRelease, this);
    this.button_down.onInputDown.add(actionOnDownClick, this);
    this.button_down.onInputUp.add(actionOnDownRelease, this);

    selectLeftPaddle.visible = false;
    selectRightPaddle.visible = false;
    this.title.text = 'Lets Play Pong!';
    ready = true;
  },

  createScoreBoard: function() {
    this.backgroundGraphics = remote.add.graphics(0, 0);
    this.backgroundGraphics.lineStyle(1, 0xFFFFFF, 1);
    this.backgroundGraphics.moveTo(0, remote.world.height - 100)
    this.backgroundGraphics.lineTo(remote.world.width, remote.world.height - 100)
    this.backgroundGraphics.moveTo(remote.world.centerX, remote.world.height - 100)
    this.backgroundGraphics.lineTo(remote.world.centerX, remote.world.height)

    this.tf_scoreLeft = remote.add.text(fontAssets.scoreLeft_x, fontAssets.scoreTop_y, '0', fontAssets.redFontStyle);
    this.tf_scoreLeft.anchor.set(0.5, 0);

    this.tf_scoreRight = remote.add.text(fontAssets.scoreRight_x, fontAssets.scoreTop_y, '0', fontAssets.greenFontStyle);
    this.tf_scoreRight.anchor.set(0.5, 0);
  },

  createTitle: function() {
    this.title = remote.add.text(remote.world.centerX, remote.world.bottom, 'Select Paddle Side', fontAssets.fontStyle);
    this.title.anchor.set(0.5, 0);
  },
};

function actionOnLeftClick() {
  left = true;
  paddleChoice = 'L'
};

function actionOnRightClick() {
  right = true;
  paddleChoice = 'R';
};

function actionOnUpClick() {
  paddle_up = true
};

function actionOnUpRelease() {
  paddle_up = false
};

function actionOnDownClick() {
  paddle_down = true
};

function actionOnDownRelease() {
  paddle_down = false
};

createRemote = function(remoteDiv) {
  remote = new Phaser.Game(remoteProperties.screenWidth, remoteProperties.screenHeight, Phaser.AUTO, remoteDiv);
  remote.state.add('main', mainState);
  remote.state.start('main');
}
