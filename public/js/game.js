/******************\
|   Velociraptor   |
|      Escape      |
| @author Anthony  |
| @version 0.4     |
| @date 2016/07/12 |
| @edit 2016/07/12 |
\******************/

var GameEngine = (function() {
  'use strict';

  // config
  var UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3, PAUSE = 4;
  var MOVE_EVERY = 200; // ms

  // working variables
  var movementQueue;
  var level;
  var grid;
  var nextFrame;
  var interpreter;
  var currentInterval;

  function initGameEngine(level_) {
    // init misc variables
    movementQueue = [];
    nextFrame = 0;
    currentInterval = null;

    // setup the level
    level = level_;
    MOVE_EVERY = level.rate;
    grid = new Grid.Grid(
      level.dimensions[0], level.dimensions[1],
      level.start, level.finish
    );
    document.getElementById('code-length').innerHTML = level.limits.code;
    document.getElementById('code-compute').innerHTML = level.limits.compute;

    // setup the grid and render it
    grid.fromFrame(level.frames[0]);
    grid.render();

    // setup the interpreter
    var builtIns = {
      'log': function() {
        console.log.apply(console, arguments);
        return undefined;
      },

      'random': function(n) {
        return Math.floor(n * Math.random());
      },

      'moveUp': function() {
        queueMovement(UP);
        return undefined;
      },

      'moveRight': function() {
        queueMovement(RIGHT);
        return undefined;
      },

      'moveDown': function() {
        queueMovement(DOWN);
        return undefined;
      },

      'dontMove': function() {
        queueMovement(PAUSE);
        return undefined;
      },

      'moveLeft': function() {
        queueMovement(LEFT);
        return undefined;
      },

      'move': function(direction) {
        queueMovement(direction);
        return undefined;
      }
    };
    interpreter = new Interpreter.Interpreter(
      LanguageGrammar(Object.keys(builtIns)).grammar,
      LanguageStructure.structure,
      builtIns
    );
  }

  function runProgram(program) {
    var stats = interpreter.interpret(program, level.limits);
    console.log(stats);
  }

  function executeMovement(movement) {
    var agentLocation = grid.getAgentLoc();
    grid.setAgentLoc([
      agentLocation[0] + movement[0],
      agentLocation[1] + movement[1]
    ]);
  }

  function queueMovement(direction) {
    switch (direction) {
      case UP:
        movementQueue.push([-1, 0]);
        break;
      case RIGHT:
        movementQueue.push([0, 1]);
        break;
      case DOWN:
        movementQueue.push([1, 0]);
        break;
      case LEFT:
        movementQueue.push([0, -1]);
      case PAUSE:
        movementQueue.push([0, 0]);
        break;
      default:
        throw 'ERR: invalid movement direction supplied.';
    }
  }

  function reset(done) {
    clearInterval(currentInterval);
    movementQueue = [];
    grid.fromFrame(level.frames[0]);
    grid.setAgentLoc(grid.start);
    grid.render();
    time.innerHTML = 0;
    nextFrame = 0;
    done();
  }

  var time = document.getElementById('time');

  function watch(done) {
    currentInterval = setInterval(watchCallback, MOVE_EVERY);
    grid.setAgentLoc(false);
    grid.render();
    function watchCallback() {
      if(nextFrame < level.frames.length) {
        grid.fromFrame(level.frames[nextFrame]);
        grid.render();
        time.innerHTML = nextFrame;
        nextFrame += 1;
      } else {
        clearInterval(currentInterval);
        grid.setAgentLoc(grid.start);
        grid.render();
        nextFrame = 0;
        done();
      }
    }
  }

  function run(program, onCollision, onSuccess, done) {
    grid.fromFrame(level.frames[0]);
    grid.setAgentLoc(level.start);
    grid.render();

    // get the movements queued by the program
    runProgram(program);

    currentInterval = setInterval(runCallback, MOVE_EVERY);
    function runCallback() {
      if (nextFrame < level.frames.length && movementQueue.length > 0) {
        // move the velociraptors
        grid.fromFrame(level.frames[nextFrame]);

        // update the time
        time.innerHTML = nextFrame;
        nextFrame += 1;

        // move the agent
        executeMovement(movementQueue.shift());

        // render
        grid.render();

        // check for collisions
        var loc = grid.getAgentLoc();
        if (grid.getState(loc[0], loc[1]) === Grid.FULL) {
          // call the onCollision callback
          clearInterval(currentInterval);
          return onCollision();
        }

        // check for success
        if (loc[0] === grid.end[0] && loc[1] === grid.end[1]) {
          clearInterval(currentInterval);
          return onSuccess();
        }
      } else {
        clearInterval(currentInterval);
        done();
        nextFrame = 0;
      }
    }
  }

  return {
    init: initGameEngine,
    move: queueMovement,
    runProgram: runProgram,
    UP: UP, RIGHT: RIGHT, DOWN: DOWN, LEFT: LEFT,
    watch: watch, run: run, reset: reset,
    parse: function(input) { return interpreter.parse(input); }
  };
})();
