/*
 * Setup Libraries and routes
 * @author - Mac Liu
 */

var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    path = require('path'),
    Promise = require('bluebird'),
    model = require('./model'),
    User = model.User;

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

function validateProgram(program) {
  return true;
}

app.get('/', function(req, res) {
  res.sendfile('homepage.html', {root: './public'});
});

app.get('/:userName/:levelId', function(req, res) {
  res.sendfile('index.html', {root: './public'});
});

app.get('/:userName', function(req, res) {
  res.redirect('/'+req.params.userName+'/0');
});

app.post('/:userName/:levelId/validate', function(req, res) {
  var user = new User(req.params.userName);
  var levelId = req.params.levelId;

  var programText = req.body.text;
  var programAst = req.body.ast;

  if(programText == null || programAst == null) {
    res.status(400).end("bad request");
    return;
  }

  user.hasCompletedLevel(levelId).then(function(hasCompletedLevel) {
    if(!hasCompletedLevel && validateProgram(null)) {
      return user.completedLevel(levelId);
    } else return Promise.resolve();
  }).then(function() { return user.remainingLevels(); })
  .then(function(remaining) {
    var verify = null;
    if (remaining.length === 0) verify = user.generateHash();
    res.json({
      "verify": verify,
      "remaining": remaining
    });
  });
});

module.exports = app;
