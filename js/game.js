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
  var DIMS = [6, 6];
  var STARTING_LOCATION = [4, 4];
  var MOVE_EVERY = 1000; // ms

  // working variables
  var grid;
  var movementQueue;

  function initGameEngine() {
    grid = new Grid.Grid(DIMS[0], DIMS[1], STARTING_LOCATION); 

    grid.render();

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
  
  return {
    init: initGameEngine,
    move: queueMovement,
    UP: UP,
    RIGHT: RIGHT,
    DOWN: DOWN,
    LEFT: LEFT
  };
})();

