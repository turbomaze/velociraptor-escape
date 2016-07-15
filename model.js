module.exports = (function () {
  "use strict";
  var crypto = require('crypto');

  var Promise = require("bluebird");

  var Redis = require('ioredis');
  var redis = new Redis();

  var config = require('./config.json');

  var VALID_LEVELS = ["01", "02"];

  function isValidLevel(levelId) {
    return  VALID_LEVELS.indexOf(levelId !== -1);
  }

  function getUserKey(username) {
    return 'user:' + username;
  }

  function User(name) {
    this.name = name;
    this.nameKey = getUserKey(name);
  }

  User.prototype.completedLevel = function(levelId) {
    if(isValidLevel(levelId)) return redis.sadd(this.nameKey, levelId);
    return Promise.resolve();
  };

  User.prototype.hasCompletedLevel = function(levelId) {
    if(isValidLevel(levelId)){
      return redis.sismember(this.nameKey, levelId);
    } else return Promise.resolve(true);
  };

  User.prototype.remainingLevels = function() {
    return redis.smembers(this.nameKey).then(function(levelIds) {
      var remaining = [];
      VALID_LEVELS.forEach(function(levelId) {
        if(levelIds.indexOf(levelId) == -1) remaining.push(levelId);
      });
      return remaining;
    });
  };

  User.prototype.generateHash = function() {
    return crypto.createHmac('sha256', config.secret)
              .update('velociraptor:' + this.name)
              .digest('hex');
  };

  return {User: User};
})();
