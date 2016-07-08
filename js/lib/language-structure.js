/******************\
|     Language     |
|     Structure    |
| @author Anthony  |
| @version 0.2     |
| @date 2016/07/07 |
| @edit 2016/07/07 |
\******************/

var LanguageStructure = {
  'expression': function(args) {
    var struct = args[0];
    var plusExpressions = args[1];
    plusExpressions.forEach(function(plusExpression) {
      var unit = [];
      unit.push(plusExpression[0]);
      unit.push(struct);
      unit.push(plusExpression[1]);
      struct = unit;
    });
    return struct;
  },

  'term': function(args) {
    var struct = args[0];
    var timesExpressions = args[1];
    timesExpressions.forEach(function(timesExpression) {
      var unit = [];
      unit.push(timesExpression[0]);
      unit.push(struct);
      unit.push(timesExpression[1]);
      struct = unit;
    });
    return struct;
  },

  'group': [
    function(number) {
      return number;
    },

    function(args) {
      return args[1];
    }
  ],

  'number': function(digits) {
    var sum = 0;
    for (var i = 0; i < digits.length; i++) {
      var place = digits.length - i - 1;
      sum += digits[i] * Math.pow(10, place);
    }
    return sum;
  },

  'left': function(left) {return left;},
  'right': function(right) {return right;},
  'plus': function(plus) {return plus;},
  'times': function(times) {return times;},
  'digit': function(number) {return parseInt(number);}
};
