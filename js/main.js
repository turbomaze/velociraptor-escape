/******************\
|   Velociraptor   |
|      Escape      |
| @author Anthony  |
| @version 0.3     |
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
    var submitBtn = document.getElementById('submit-btn');
    var watchBtn = document.getElementById('watch-btn');
    var resetBtn = document.getElementById('reset-btn');

    runBtn.addEventListener('click',function() {
      var textarea = document.getElementById('textbox');
      var text = textarea.value;
      disableButtons();
      GameEngine.run(text.replace(/\r/g, ''), function() {
        enableButtons();
      });
    });

    submitBtn.addEventListener('click', function() {
      var textarea = document.getElementById('textbox');
      var text = textarea.value;
      //process text
      console.log('SUBMIT ' + text);
    });

    watchBtn.addEventListener('click', function(){
      disableButtons();
      GameEngine.watch(function() {
        enableButtons();
      });
    });

    resetBtn.addEventListener('click', function(){
      disableButtons();
      GameEngine.reset(function() {
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
