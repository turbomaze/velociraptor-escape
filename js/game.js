/******************\
|   Velociraptor   |
|      Escape      |
| @author Anthony  |
| @version 0.1     |
| @date 2016/07/12 |
| @edit 2016/07/12 |
\******************/

var GameEngine = (function() {
  'use strict';

  // config
  var UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;
  var MOVE_EVERY = 1000; // ms

  // working variables
  var grid;
  var movementQueue;
  var level;
  var nextFrame = 1;

  function initGameEngine(level_) {
    level = level_;
    grid = new Grid.Grid(level.dimensions[0], level.dimensions[1], level.start);

    grid.render();
    grid.fromFrame(level.frames[0]);

    movementQueue = [];

    setInterval(function() {
      if (movementQueue.length > 0) {
        executeMovement(movementQueue.shift());
      }
    }, MOVE_EVERY);
  }

  function executeMovement(movement) {
    var agentLocation = grid.getAgentLoc();
    grid.clear(agentLocation[0], agentLocation[1]);
    grid.setState(
      agentLocation[0]+movement[0],
      agentLocation[1]+movement[1],
      Grid.AGENT
    );
    console.log('Executed movement: ' + movement);
  }

  function queueMovement(direction) {
    switch (direction) {
      case UP:
        movementQueue.push([0, -1]);
        break;
      case RIGHT:
        movementQueue.push([1, 0]);
        break;
      case DOWN:
        movementQueue.push([0, 1]);
        break;
      case LEFT:
        movementQueue.push([-1, 0]);
        break;
      default:
        throw 'ERR: invalid movement direction supplied.';
    }
  }

  function watch(done) {
    var watchInterval = setInterval(watchCallback, MOVE_EVERY);
    function watchCallback() {
      if(nextFrame < level.frames.length) {
        grid.fromFrame(level.frames[nextFrame]);
        nextFrame += 1;
      } else {
        clearInterval(watchInterval);
        done();
        nextFrame = 0;
      }
    }
  }

  return {
    init: initGameEngine,
    move: queueMovement,
    UP: UP,
    RIGHT: RIGHT,
    DOWN: DOWN,
    LEFT: LEFT,
    watch: watch
  };
})();
