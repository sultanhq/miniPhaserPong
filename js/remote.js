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

var ready = false;

var socket = io();

var fontAssets = {
  FontStyle: {
    font: '22px monospace',
    fill: '#FFFFFF',
    align: 'center'
  },
};


var mainState = function(remote) {
  this.title;

  this.selectLeftPaddle;
  this.selectRightPaddle;

  this.button_up;
  this.button_down;

  this.score;
  this.tf_score;
}

mainState.prototype = {
  preload: function() {
    remote.stage.disableVisibilityChange = true;

    remote.load.image('upButton', 'assets/up.png');
    remote.load.image('downButton', 'assets/down.png');
    remote.load.image('leftButton', 'assets/left.png');
    remote.load.image('rightButton', 'assets/right.png');
    socket.on('score', function(data) {console.log(data.score)});

  },

  create: function() {
    this.createTitle();
    this.createPaddleChoiceButtons();
  },

  update: function() {
    this.checkForChoice();
    this.checkForControl();
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

  checkForControl: function (){
    if (paddle_up) {
      // console.log("sending up message");
      socket.emit(paddleChoice + 'control message', 'up');
    } else if (paddle_down) {
      // console.log("sending down message");
      socket.emit(paddleChoice + 'control message', 'down');
    }
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
  },

  createTitle() {
    this.title = remote.add.text(8, remote.world.bottom, 'Select Paddle side', fontAssets.FontStyle);
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
