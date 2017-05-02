var remoteProperties = {
  screenWidth: 300,
  screenHeight: 300,
};

var left = false;
var right = false;
var paddle_up = false;
var paddle_down = false;
var paddle_choice;
var playerID;
var spaces = ['', '']
var scores = ["0", "0"];
var gameWinner;

var ready = false;

var pongSocket = io('/pong');

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
  this.restart;
};

mainState.prototype = {
  preload: function() {
    remote.stage.disableVisibilityChange = true;
    remote.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    remote.load.image('leftButton', 'assets/left.png');
    remote.load.image('rightButton', 'assets/right.png');
    remote.load.image('LUpButton', 'assets/lUp.png');
    remote.load.image('LDownButton', 'assets/lDown.png');
    remote.load.image('RUpButton', 'assets/rUp.png');
    remote.load.image('RDownButton', 'assets/rDown.png');
    remote.load.image('restart', 'assets/restart.png');
  },

  create: function() {
    this.createTitle();
    this.createSocketListeners();
    this.sendCheckForSpace();
    this.createScoreBoard();
    this.createPaddleChoiceButtons();
  },

  update: function() {
    this.checkForControl();
  },

  gameOver: function(data) {
    gameWinner = data;
    this.gameOverGraphics();
    this.gameOverSettings();
    pongSocket.close();
  },

  joinGame: function(side) {
    pongSocket.emit('join', {
      id: pongSocket.id,
      side: side,
    });
  },

  gameOverGraphics: function() {
    this.updateTitleText(gameWinner + ' Wins!');
    this.button_up.visible = false;
    this.button_down.visible = false;
    restart = remote.add.button(remote.world.centerX, remote.world.centerY, 'restart');
    restart.anchor.set(0.5, 0.5);
    restart.visible = true;
  },

  gameOverSettings: function() {
    left = false;
    right = false;
    restart.onInputDown.add(this.startNewGame, this);
  },

  startNewGame: function() {
    pongSocket.connect();
    this.showScoreBoard(false);
    ready = false;
    this.tf_scoreLeft.text = 0;
    this.tf_scoreRight.text = 0;
    restart.onInputDown.remove(this.startNewGame, this);
    restart.visible = false;
    this.sendCheckForSpace();
  },

  createSocketListeners: function() {
    pongSocket.on('spaces', function(data) {
      if (!ready) {
        this.updateSpaces(data);
      }
    }.bind(this));
    pongSocket.on('score', function(data) {
      if (ready) {
        this.updateScores(data);
      }
    }.bind(this));
    pongSocket.on('winner', function(data) {
      if (ready) {
        this.gameOver(data);
      }
    }.bind(this));
  },

  updateSpaces: function(data) {
    spaces = (data);
    this.showAvailableChoices();
  },

  sendCheckForSpace: function(data) {
    pongSocket.emit('check');
  },

  checkForChoice: function() {
    if (!ready) {
      if (left) {
        paddleChoice = 'L';
        this.joinGame(paddleChoice);
        this.createPaddleButtons();
      } else if (right) {
        paddleChoice = 'R';
        this.joinGame(paddleChoice);
        this.createPaddleButtons();
      } else return;
    }
  },

  checkForControl: function() {
    if (paddle_up) {
      pongSocket.emit(paddleChoice + 'control message', {
        id: pongSocket.id,
        direction: 'up',
      });
    } else if (paddle_down) {
      pongSocket.emit(paddleChoice + 'control message', {
        id: pongSocket.id,
        direction: 'down',
      });
    }
  },

  updateScores: function(data) {
    scores = data.score.split(',');
    if (ready) {
      this.scoreLeft = scores[0];
      this.scoreRight = scores[1];
      this.tf_scoreLeft.text = this.scoreLeft;
      this.tf_scoreRight.text = this.scoreRight;
    }
  },

  createPaddleChoiceButtons: function() {
    selectLeftPaddle = remote.add.button(remoteProperties.screenWidth * 0.25, remote.world.centerY, 'leftButton');
    selectLeftPaddle.anchor.set(0.5, 0.5);
    selectLeftPaddle.onInputDown.add(actionOnLeftClick, this);

    selectRightPaddle = remote.add.button(remoteProperties.screenWidth * 0.75, remote.world.centerY, 'rightButton');
    selectRightPaddle.anchor.set(0.5, 0.5);
    selectRightPaddle.onInputDown.add(actionOnRightClick, this);
    this.hidePaddleChoiceButtons();
  },

  showAvailableChoices: function() {
    this.hidePaddleChoiceButtons();

    this.updateTitleText('Select Paddle Side');
    if (spaces[0] === 'L') {
      selectLeftPaddle.visible = true;
    }
    if (spaces[1] === 'R') {
      selectRightPaddle.visible = true;
    }
  },

  createPaddleButtons: function() {
    if (paddleChoice === 'L') {
      this.button_up = remote.add.button(remoteProperties.screenWidth * 0.25, remote.world.centerY * 0.5, 'LUpButton');
      this.button_down = remote.add.button(remoteProperties.screenWidth * 0.25, remote.world.centerY, 'LDownButton');
    } else if (paddleChoice === 'R') {
      this.button_up = remote.add.button(remoteProperties.screenWidth * 0.75, remote.world.centerY * 0.5, 'RUpButton');
      this.button_down = remote.add.button(remoteProperties.screenWidth * 0.75, remote.world.centerY, 'RDownButton');
    }

    this.button_up.anchor.set(0.5, 0.5);
    this.button_down.anchor.set(0.5, 0.5);
    this.button_up.onInputDown.add(actionOnUpClick, this);
    this.button_up.onInputUp.add(actionOnUpRelease, this);
    this.button_down.onInputDown.add(actionOnDownClick, this);
    this.button_down.onInputUp.add(actionOnDownRelease, this);

    this.updateTitleText("Let's Play Pong!");

    this.showScoreBoard(true);
    ready = true;
  },

  updateTitleText: function(data) {
    this.title.text = data;
  },

  hidePaddleChoiceButtons: function() {
    selectLeftPaddle.visible = false;
    selectRightPaddle.visible = false;
  },

  createScoreBoard: function() {
    this.scoreBoard = remote.add.group();
    this.backgroundGraphics = remote.add.graphics(0, 0);
    this.backgroundGraphics.lineStyle(1, 0xFFFFFF, 1);
    this.backgroundGraphics.moveTo(0, remote.world.height - 100);
    this.backgroundGraphics.lineTo(remote.world.width, remote.world.height - 100);
    this.backgroundGraphics.moveTo(remote.world.centerX, remote.world.height - 100);
    this.backgroundGraphics.lineTo(remote.world.centerX, remote.world.height);
    this.tf_scoreLeft = remote.add.text(fontAssets.scoreLeft_x, fontAssets.scoreTop_y, '0', fontAssets.redFontStyle);
    this.tf_scoreLeft.anchor.set(0.5, 0);

    this.tf_scoreRight = remote.add.text(fontAssets.scoreRight_x, fontAssets.scoreTop_y, '0', fontAssets.greenFontStyle);
    this.tf_scoreRight.anchor.set(0.5, 0);

    this.scoreBoard.add(this.backgroundGraphics)
    this.scoreBoard.add(this.tf_scoreLeft)
    this.scoreBoard.add(this.tf_scoreRight)

    this.showScoreBoard(false);

  },

  showScoreBoard: function(bool) {
    this.scoreBoard.visible = bool
  },

  createTitle: function() {
    this.title = remote.add.text(remote.world.centerX, remote.world.bottom, '', fontAssets.fontStyle);
    this.title.anchor.set(0.5, 0);
    this.updateTitleText('Searching for Games');
  },
};

function actionOnLeftClick() {
  left = true;
  paddleChoice = 'L';
  this.hidePaddleChoiceButtons();
  this.checkForChoice();
  pongSocket.emit('newGame');

}

function actionOnRightClick() {
  right = true;
  paddleChoice = 'R';
  this.hidePaddleChoiceButtons();
  this.checkForChoice();
  pongSocket.emit('newGame');
}

function actionOnUpClick() {
  paddle_up = true;
}

function actionOnUpRelease() {
  paddle_up = false;
}

function actionOnDownClick() {
  paddle_down = true;
}

function actionOnDownRelease() {
  paddle_down = false;
}

createRemote = function(remoteDiv) {
  remote = new Phaser.Game(remoteProperties.screenWidth, remoteProperties.screenHeight, Phaser.AUTO, remoteDiv);
  remote.state.add('main', mainState);
  remote.state.start('main');
};
