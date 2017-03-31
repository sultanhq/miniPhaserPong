var remoteProperties = {
  screenWidth: 100,
  screenHeight: 100,
}

var paddle_up = false;
var paddle_down = false;


var ready = false;

var socket = io();


var mainState = function(remote) {
  this.button_up;
  this.button_down;

  this.score;
  this.tf_score;
}

mainState.prototype = {
  preload: function() {
    remote.load.image('up', 'assets/up.png');
    remote.load.image('down', 'assets/down.png');
  },

  create: function() {
    this.createButtons();
  },

  update: function() {
    // if (!ready) return;
    if (paddle_up) {
      console.log("sending up message");
      socket.emit('control message', 'up');
    } else if (paddle_down) {
      console.log("sending down message");
      socket.emit('control message', 'down');

    }
  },

  createButtons: function() {
    button_up = remote.add.button(remote.world.centerX, remote.world.centerY * 0.25, 'up');
    button_up.onInputDown.add(actionOnUpClick, this);
    button_up.onInputUp.add(actionOnUpRelease, this);

    button_down = remote.add.button(remote.world.centerX, remote.world.centerY * 0.75, 'down');
    button_down.onInputDown.add(actionOnDownClick, this);
    button_down.onInputUp.add(actionOnDownRelease, this);

  },

}

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
