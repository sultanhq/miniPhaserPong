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

var scores = ["0","0"];

var ready = false;
var newScore = false;

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

  scoreFontStyle: {
    font: '50px monospace',
    fill: '#FFFFFF',
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

    remote.load.image('upButton', 'assets/up.png');
    remote.load.image('downButton', 'assets/down.png');
    remote.load.image('leftButton', 'assets/left.png');
    remote.load.image('rightButton', 'assets/right.png');

    this.createSocketListeners();
  },

  create: function() {
    this.createTitle();
    this.createPaddleChoiceButtons();
  },

  update: function() {
    this.checkForChoice();
    this.checkForControl();
    if (newScore) {
      this.updateScores();
      newScore = false;
    }
  },

  createSocketListeners: function() {
    socket.on('score', function(data) {
      scores = data.score.split(',')
      newScore = true;
    });
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
      // console.log("sending up message");
      socket.emit(paddleChoice + 'control message', 'up');
    } else if (paddle_down) {
      // console.log("sending down message");
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
    selectLeftPaddle = remote.add.button(remote.world.centerX - 50, remote.world.centerY, 'leftButton');
    selectLeftPaddle.onInputDown.add(actionOnLeftClick, this);

    selectRightPaddle = remote.add.button(remote.world.centerX + 25, remote.world.centerY, 'rightButton');
    selectRightPaddle.onInputDown.add(actionOnRightClick, this);

  },

  createPaddleButtons: function() {
    if (paddleChoice === 'L') {
      button_up = remote.add.button(remote.world.centerX - 50, remote.world.centerY - 50, 'upButton');
      button_down = remote.add.button(remote.world.centerX - 50, remote.world.centerY - 25, 'downButton');
    } else {
      button_up = remote.add.button(remote.world.centerX + 25, remote.world.centerY - 50, 'upButton');
      button_down = remote.add.button(remote.world.centerX + 25, remote.world.centerY - 25, 'downButton');
    }
    button_up.onInputDown.add(actionOnUpClick, this);
    button_up.onInputUp.add(actionOnUpRelease, this);
    button_down.onInputDown.add(actionOnDownClick, this);
    button_down.onInputUp.add(actionOnDownRelease, this);

    selectLeftPaddle.visible = false;
    selectRightPaddle.visible = false;
    this.title.text = 'Pong!';
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

    this.tf_scoreLeft = remote.add.text(fontAssets.scoreLeft_x, fontAssets.scoreTop_y, '0', fontAssets.scoreFontStyle);
    this.tf_scoreLeft.anchor.set(0.5, 0);

    this.tf_scoreRight = remote.add.text(fontAssets.scoreRight_x, fontAssets.scoreTop_y, '0', fontAssets.scoreFontStyle);
    this.tf_scoreRight.anchor.set(0.5, 0);
  },

  createTitle: function() {
    this.title = remote.add.text(8, remote.world.bottom, 'Select Paddle side', fontAssets.fontStyle);
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
