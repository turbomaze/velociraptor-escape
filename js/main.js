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
  var parser;

  /******************
   * work functions */
  function initVelociraptorEscape() {
    console.log('Loaded');

    // set up the language parser
    parser = new Parser(LanguageGrammar, LanguageStructure);

    // test an input program
    var input = '\
triple => x { \
  return 3*x \
} \n\
\
31 + 1 > a*1 + 3 { \n\
  let x = 311 \n\
} : { \n\
  let x = 55   \n\
} \n\
\
let y = 10 \n\
';
    parse('program', input);
  }

  function parse(goal, input) {
    var tokens = input.split('');
    console.log(input);
    console.log(JSON.stringify(parser.parse(goal, tokens)));
  }

  return {
    init: initVelociraptorEscape
  };
})();

window.addEventListener('load', VelociraptorEscape.init);
