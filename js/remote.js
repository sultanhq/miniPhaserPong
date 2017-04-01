var remoteProperties = {
  screenWidth: 100,
  screenHeight: 100,
}

var left = false;
var right = false;
var paddle_up = false;
var paddle_down = false;
var paddle_choice;


var ready = false;

var socket = io();


var mainState = function(remote) {
  this.title;

  this.selectLeftPaddle;
  this.selectRightPaddle;
  this.choiceGroup;

  this.button_up;
  this.button_down;

  this.score;
  this.tf_score;
}

mainState.prototype = {
  preload: function() {
    remote.load.image('up', 'assets/up.png');
    remote.load.image('down', 'assets/down.png');
    remote.load.image('left', 'assets/left.png');
    remote.load.image('right', 'assets/right.png');

  },

  create: function() {
    // paddleChoice = 'R'
    // this.createTitle();
    this.createPaddleChoiceButtons();
  },

  update: function() {
    if (left) {
      paddleChoice = 'L'
      this.createPaddleButtons();
    } else if (right) {
      paddleChoice = 'R'
      this.createPaddleButtons();
    } else return;

    if (paddle_up) {
      console.log("sending up message");
      socket.emit(paddleChoice + 'control message', 'up');
    } else if (paddle_down) {
      console.log("sending down message");
      socket.emit(paddleChoice + 'control message', 'down');
    }
  },

  createPaddleChoiceButtons: function() {
    selectLeftPaddle = remote.add.button(remote.world.centerX * 0.25, remote.world.centerY, 'left');
    selectLeftPaddle.onInputDown.add(actionOnLeftClick, this);

    selectRightPaddle = remote.add.button(remote.world.centerX * 0.75, remote.world.centerY, 'right');
    selectRightPaddle.onInputDown.add(actionOnRightClick, this);

  },

  createPaddleButtons: function() {
    button_up = remote.add.button(remote.world.centerX, remote.world.centerY * 0.25, 'up');
    button_up.onInputDown.add(actionOnUpClick, this);
    button_up.onInputUp.add(actionOnUpRelease, this);

    button_down = remote.add.button(remote.world.centerX, remote.world.centerY * 0.75, 'down');
    button_down.onInputDown.add(actionOnDownClick, this);
    button_down.onInputUp.add(actionOnDownRelease, this);

  },

}
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
