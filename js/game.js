/******************\
|   Velociraptor   |
|      Escape      |
| @author Anthony  |
| @version 0.3     |
| @date 2016/07/12 |
| @edit 2016/07/12 |
\******************/

var GameEngine = (function() {
  'use strict';

  // config
  var UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;
  var MOVE_EVERY = 200; // ms

  // working variables
  var movementQueue;
  var level;
  var grid;
  var nextFrame;
  var interpreter;

  function initGameEngine(level_) {
    // init misc variables
    movementQueue = [];
    nextFrame = 1;

    // setup the level
    level = level_;
    MOVE_EVERY = level.rate;
    grid = new Grid.Grid(
      level.dimensions[0], level.dimensions[1],
      level.start, level.finish
    );

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
    try {
      var stats = interpreter.interpret(program, level.limits);
      console.log(stats);
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }

  function executeMovement(movement) {
    var agentLocation = grid.getAgentLoc();
    grid.setAgentLoc([
      agentLocation[0] + movement[0],
      agentLocation[1] + movement[1]
    ]);
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

  function reset(done) {
    grid.fromFrame(level.frames[0]);
    grid.setAgentLoc(grid.start);
    grid.render();
    done();
  }

  function watch(done) {
    var watchInterval = setInterval(watchCallback, MOVE_EVERY);
    grid.setAgentLoc(grid.start);
    grid.render();
    function watchCallback() {
      if(nextFrame < level.frames.length) {
        grid.fromFrame(level.frames[nextFrame]);
        grid.render();
        nextFrame += 1;
      } else {
        clearInterval(watchInterval);
        grid.setAgentLoc(grid.start);
        done();
        nextFrame = 0;
      }
    }
  }

  function run(program, done) {
    grid.clearAll();
    grid.render();
    grid.setState(level.start[0], level.start[1], Grid.AGENT);
    grid.fromFrame(level.frames[0]);
    grid.render();
    
    runProgram(program);

    var runInterval = setInterval(runCallback, MOVE_EVERY);
    function runCallback() {
      if(nextFrame < level.frames.length || movementQueue.length > 0) {
        if(nextFrame < level.frames.length) {
          grid.fromFrame(level.frames[nextFrame]);
          grid.render();
          nextFrame += 1;
        }
        if (movementQueue.length > 0) {
          executeMovement(movementQueue.shift());
        }
      } else {
        clearInterval(runInterval);
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
    watch: watch, run: run, reset: reset
  };
})();
