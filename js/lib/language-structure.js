/******************\
|     Language     |
|     Structure    |
| @author Anthony  |
| @version 0.1     |
| @date 2016/07/07 |
| @edit 2016/07/08 |
\******************/

var LanguageStructure = (function() {
  // helper functions
  function binaryFunction(args) {
    return {
      'type': 'function',
      'name': args[2],
      'arguments': [args[0], args[4]]
    };
  }

  function chainedBinaryFunctions(args) {
    var struct = args[0];
    var opExpressions = args[1];
    opExpressions.forEach(function(opExpression) {
      var unit = {
        'type': 'function',
        'name': opExpression[1],
        'arguments': [struct, opExpression[3]]
      };
      struct = unit;
    });
    return struct;
  }
  
  function first(args) { return args[0]; }
  function second(args) { return args[1]; }
  function third(args) { return args[2]; }
    
  // structural rules
  return {
    // higher level language concepts
    'program': second,
    'statements': function(args) {
      return [args[0]].concat(args[1].map(function(newlineStatement) {
        return newlineStatement[2];  
      }));
    },
    'ifElse': function(args) {
      return {
        'type': 'if', 'predicate': args[0], 'body': args[2], 'else': args[6]
      };
    },
    'if': function(args) {
      return {
        'type': 'if', 'predicate': args[0], 'body': args[2]
      };
    },
    'block': function(args) {
      return {
        'type': 'block', 'statements': args[2]
      };
    },
    'declaration': function(args) {
      var identifier = args[2]; 
      var value = args[6]; 
      return {
        'type': 'declaration', 'identifier': identifier, 'value': value
      };
    },

    // boolean expressions
    'boolExpression': chainedBinaryFunctions,
    'boolTerm': chainedBinaryFunctions,
    'boolGroup': [binaryFunction, third],

    // numeric expressions
    'numExpression': chainedBinaryFunctions,
    'term': chainedBinaryFunctions,
    'group': [null, null, third],

    // basic helpers
    'identifier': function(args) {
      var chars = [args[0]].concat(args[1]);
      var word = '';
      for (var i = 0; i < chars.length; i++) {
        word += chars[i];
      }
      return word;
    },
    'number': function(args) {
      var digits = [args[0]].concat(args[1]);
      var sum = 0;
      for (var i = 0; i < digits.length; i++) {
        var place = digits.length - i - 1;
        sum += digits[i] * Math.pow(10, place);
      }
      return sum;
    },

    // fundamental building blocks (terminals)
    'space': function(space) {return ' ';},
    'digit': function(number) {return parseInt(number);}
  };
})();

