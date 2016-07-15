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
    Level.loadLevel('04', function(level) {
      GameEngine.init(level);
    });

    //button things
    var runBtn = document.getElementById('run-btn');
    var submitBtn = document.getElementById('submit-btn');
    var watchBtn = document.getElementById('watch-btn');
    var resetBtn = document.getElementById('reset-btn');
    var prevLevelBtn = document.getElementById('prev-level-btn');
    var nextLevelBtn = document.getElementById('next-level-btn');

    var base_url = "/";
    var maxLevel = 10; // inclusive
    //Add prev/next level buttons
    var url = window.location.href.split("/");
    var username = url[url.length-2];
    var levelId = url[url.length-1];
    levelId = parseInt(levelId);
    if (levelId === 0) {
      prevLevelBtn.className += " disabled";
      nextLevelBtn.href = base_url + username + "/1";
    } else if (levelId > 0 && levelId < 10) {
      prevLevelBtn.href = base_url + username + "/"+(levelId-1).toString();
      nextLevelBtn.href = base_url + username + "/"+ (levelId+1).toString();
    } else if (levelId === 10) {
      prevLevelBtn.href = base_url + username + "/"+ (levelId-1).toString();
      nextLevelBtn.className += " disabled";
    }

    runBtn.addEventListener('click',function() {
      var textarea = document.getElementById('textbox');
      var text = textarea.value;
      disableButtons();
      try {
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
      } catch (e) {
        sendAlert(e.message);
        enableButtons();
      }
    });

    submitBtn.addEventListener('click', function() {
      disableButtons();
      var textarea = document.getElementById('textbox');
      var text = textarea.value;
      try {
        var ast = GameEngine.parse(text.replace(/\r/g, ''));
        var url = window.location.href.split("/");
        var username = url[url.length-2];
        var levelId = url[url.length-1];
        Http.post(
          '/'+username+'/'+levelId+'/validate', {
            "text": text, "ast": ast
          }, function(resp) {
            sendAlert(JSON.stringify(resp));
            enableButtons();
          }
        );
      } catch (e) {
        sendAlert(e.message);
        return;
      }
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
