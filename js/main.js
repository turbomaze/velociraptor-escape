/******************\
|   Velociraptor   |
|      Escape      |
| @author Anthony  |
| @version 0.1     |
| @date 2016/07/07 |
| @edit 2016/07/07 |
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
    console.log('Loaded');

    // built in functions
    var builtIns = {
      'log': function() {
        console.log.apply(console, arguments);
        return undefined;
      },

      'random': function(n) {
        return Math.floor(n * Math.random());
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
';

    interpreter.interpret(program);
  }

  return {
    init: initVelociraptorEscape
  };
})();

window.addEventListener('load', VelociraptorEscape.init);
