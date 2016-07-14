/* Http
 * @author Pat
 * @version 0.3
 * @date 2016/07/12
 * @edit 2016/07/12
 */

var Http = (function() {
  'use strict';

  var exports = {};

  exports.get = function(url, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if(req.readyState == 4) {
        if(req.status == 200) {
          var data = null;
          try {
            data = JSON.parse(req.responseText);
          } catch(e) {}
          callback(data);
        } else {
          callback(null);
        }
      }
    };
    req.open("GET", url, true);
    req.send();
  };

  return exports;
})();
