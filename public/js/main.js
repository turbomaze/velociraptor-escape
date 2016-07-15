/******************\
|   Velociraptor   |
|      Escape      |
| @author Anthony  |
| @version 0.4     |
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
    var prevLevelBtn = document.getElementById('prev-level-btn');
    var nextLevelBtn = document.getElementById('next-level-btn');

    var base_url = "http://localhost:8080/";
    var username = "randall"
    //Add prev/next level buttons
    var level = window.location.href.split("/").pop();
    if(level=="" || level=="0"){
      level = 0;
      prevLevelBtn.className += " disabled";
      nextLevelBtn.href = base_url + username + "/ "+(level+1).toString();
    }
    else{
      level = parseInt(level);
      nextLevelBtn.href = base_url + username + "/ "+(level-1).toString();
      nextLevelBtn.href = base_url + username + "/ "+ (level+1).toString();
    }

    runBtn.addEventListener('click',function() {
      var textarea = document.getElementById('textbox');
      var text = textarea.value;
      disableButtons();
      GameEngine.run(
        text.replace(/\r/g, ''),

        function onCollision() {
          sendAlert('Oops! A velociraptor ate you! Looks like you need to listen to <a href="https://xkcd.com/135/">Mr. Monroe</a>');
          enableButtons();
        },

        function onSuccess() {
          sendAlert('Congratulations! You beat the level! Click "submit" to validate your solution on the server and move on.');
          enableButtons();
        },

        function onDone() {
          enableButtons();
        }
      );
    });

    submitBtn.addEventListener('click', function() {
      disableButtons();
      var textarea = document.getElementById('textbox');
      var text = textarea.value;
      var ast = GameEngine.parse(text.replace(/\r/g, ''));

      Http.post('/userName/01/validate', {"text": text, "ast": ast}, function(resp) {
        alert(resp);
        enableButtons();
      });
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

  function sendAlert(message) {
    var alertBox = document.getElementById('alert');
    alertBox.innerHTML = message;
  }

  function clearAlert() {
    var alertBox = document.getElementById('alert');
    alertBox.innerHTML = '';
  }

  return {
    init: initVelociraptorEscape
  };
})();

window.addEventListener('load', VelociraptorEscape.init);
