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
var gameOver = false;

var ready = false;
var newScore = false;
var gameOver = false;

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

  },

  create: function() {
    this.createTitle();
    this.checkForSpace();
    this.createSocketListeners();
    this.createPaddleChoiceButtons();
  },

  update: function() {
    this.checkForChoice();
    this.checkForControl();
    if (newScore) {
      this.updateScores();
      newScore = false;
    }
    if (gameOver) {
      this.gameOverGraphics();
    }
  },


  checkForSpace: function (){
    socket.emit('check', socket.id);
  },
  
  gameOverGraphics: function(data) {
    this.title.text = gameOver + ' Wins!';
  },

  createSocketListeners: function() {
    socket.on('available', function(data) {
      console.log(data)
    });
    socket.on('score', function(data) {
      scores = data.score.split(',')
      newScore = true;
    });
    socket.on('winner', function(data) {
      gameOver = data
    });
    socket.on('winner', function(data) {
      gameOver = data
    });
  },

  gameOver: function(){

  },

  checkForChoice: function() {
    if (!ready) {
      if (left) {
        paddleChoice = 'L';
        this.createPaddleButtons();
      } else if (right) {
        paddleChoice = 'R';
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

  updateScores: function() {
    this.scoreLeft = scores[0]
    this.scoreRight = scores[1]
    this.tf_scoreLeft.text = this.scoreLeft;
    this.tf_scoreRight.text = this.scoreRight;
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
    if (paddleChoice === 'L') {
      button_up = remote.add.button(remoteProperties.screenWidth * 0.25, remote.world.centerY * 0.5, 'LUpButton');
      button_down = remote.add.button(remoteProperties.screenWidth * 0.25, remote.world.centerY, 'LDownButton');
    } else {
      button_up = remote.add.button(remoteProperties.screenWidth * 0.75, remote.world.centerY * 0.5, 'RUpButton');
      button_down = remote.add.button(remoteProperties.screenWidth * 0.75, remote.world.centerY, 'RDownButton');
    }
    button_up.anchor.set(0.5, 0.5);
    button_down.anchor.set(0.5, 0.5);
    button_up.onInputDown.add(actionOnUpClick, this);
    button_up.onInputUp.add(actionOnUpRelease, this);
    button_down.onInputDown.add(actionOnDownClick, this);
    button_down.onInputUp.add(actionOnDownRelease, this);

    selectLeftPaddle.visible = false;
    selectRightPaddle.visible = false;
    this.title.text = 'Lets Play Pong!';
    ready = true;
    this.createScoreBoard();
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
