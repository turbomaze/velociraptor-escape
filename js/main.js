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

  /******************
   * work functions */
  function initVelociraptorEscape() {
    Level.loadLevel('01', function(level) {
      GameEngine.init(level);
    });

    //button things
    var runBtn = document.getElementById('run-btn');
    runBtn.addEventListener('click',function() {
      var textarea = document.getElementById('textbox');
      var text = textarea.value;
      console.log('RUN ' + text);
    });

    var submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', function() {
      var textarea = document.getElementById('textbox');
      var text = textarea.value;
      //process text
      console.log('SUBMIT ' + text);
    });

    var watchBtn = document.getElementById('watch-btn');
    watchBtn.addEventListener('click',function(){
      disableButtons();
      GameEngine.watch(function() {
        enableButtons();
      });
    });

    function disableButtons() {
      runBtn.disabled = true;
      submitBtn.disabled = true;
      watchBtn.disabled = true;
    }

    function enableButtons() {
      runBtn.disabled = false;
      submitBtn.disabled = false;
      watchBtn.disabled = false;
    }
  }

  return {
    init: initVelociraptorEscape
  };
})();

window.addEventListener('load', VelociraptorEscape.init);
