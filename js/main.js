/******************\
|   Velociraptor   |
|      Escape      |
| @author Anthony  |
| @version 0.2     |
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

  /******************
   * work functions */
  function initVelociraptorEscape() {
    console.log('loaded');
    console.log(JSON.stringify(parse('expression', '1+2*3')));
  }

  function parse(goal, tokens) {
    return Parser.parse(
      LanguageGrammar, LanguageStructure, goal, tokens
    );
  }

  return {
    init: initVelociraptorEscape
  };
})();

window.addEventListener('load', VelociraptorEscape.init);
