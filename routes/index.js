var express = require('express');
var router = express.Router();
var path = require('path');

var User = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../../index.html'));
});

/* Post level. */
router.post('/level', function(req, res, next) {
  var username = req.body.username;
  var level = req.body.level;

 	Applicant.findOne({username : username}, function(err, user) {
 		if (err) {
 			throw err;
 		} else if (user != null) {
 			if (user.level == level) {
 				res.send("Yay it worked");
 			} else {
 				res.send("you requested the wrong level");
 			}
 		} else {
 			var newUser = new User({
 				username : username,
 				level : level
 			});

		User.createUser(newUser, function(error, user) {
			if (error) {
				res.send(null);
			} else {
				console.log(user);
				res.send("You were registered, continue onto the first leve;");			
			}

	});
	}
 	});
});

/* GET level. */
router.post('/validate/:levelid', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../views/index.html'));
});

module.exports = router;
