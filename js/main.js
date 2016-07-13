/******************\
|   Velociraptor   |
|      Escape      |
| @author Anthony  |
| @version 0.1     |
| @date 2016/07/07 |
| @edit 2016/07/13 |
\******************/

var VelociraptorEscape = (function() {
  'use strict';

  /**********
   * config */

  /*************
   * constants */

  /*********************
   * working variables */
  var interpreter;

  /******************
   * work functions */
  function initVelociraptorEscape() {
    // set up the grid
    GameEngine.init();

    //button things
    var runBtn = document.getElementById('run-btn');
    runBtn.addEventListener('click',function(){
      var textarea = document.getElementById('textbox');
      var text = textarea.value;
      console.log('RUN ' + text);
      grid.moveAgent(text);
    });

    var submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click',function(){
      var textarea = document.getElementById('textbox');
      var text = textarea.value;
      //process text
      console.log('SUBMIT ' + text);
    });

    var watchBtn = document.getElementById('watch-btn');
    watchBtn.addEventListener('click',function(){
      var textarea = document.getElementById('textbox');
      var text = textarea.value;
      //process text
      console.log('WATCH ' + text);
    });
    
    // built in functions
    var builtIns = {
      'log': function() {
        console.log.apply(console, arguments);
        return undefined;
      },

      'random': function(n) {
        return Math.floor(n * Math.random());
      },

      'move': function(direction) {
        GameEngine.move(direction);
        return undefined; 
      }
    };

    // set up the language parser
    interpreter = new Interpreter(
      LanguageGrammar.grammar, LanguageStructure.structure, builtIns
    );

    // run a program
    var program = '\
fib => n { \n\
  dec => x { return x - 1 } \n\
\n\
  n == 0 { return 0 } \n\
  n == 1 { return 1 } \n\
  return (fib -> dec -> n) + (fib -> dec -> dec -> n) \n\
} \n\
\n\
log -> fib -> 10 \n\
log -> random -> fib -> random -> 10 \n\
move -> 0 \n\
move -> 2 \n\
move -> 1 \n\
move -> 2 \n\
move -> 3 \n\
move -> 1 \n\
';

    interpreter.interpret(program);
  }

  return {
    init: initVelociraptorEscape
  };
})();

window.addEventListener('load', VelociraptorEscape.init);
