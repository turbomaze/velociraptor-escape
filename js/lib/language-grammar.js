/******************\
|     Language     |
|     Grammar      |
| @author Anthony  |
| @version 0.2     |
| @date 2016/07/07 |
| @edit 2016/07/07 |
\******************/

function getCharFunc(c) {
  return function(tokens, ret) {
    var isChar = tokens.length >= 1 && tokens[0] === c;
    if (isChar) {
      ret.newTokens = tokens.slice(1);
      ret.structure = tokens[0];
    }
    return isChar;
  };
}

var LanguageGrammar = {
  'expression': {
    'and': [
      'term',
      {
        'repeat': [
          0, 10, {'and': ['plus', 'term']}
        ]
      }
    ]
  },

  'term': {
    'and': [
      'group',
      {
        'repeat': [
          0, 5, {'and': ['times', 'group']}
        ]
      }
    ]
  },

  'group': {
    'or': [
      'number',
      {'and': ['left', 'expression', 'right']}
    ]
  },

  'number': {
    'repeat': [1, 10, 'digit']
  },

  'plus': getCharFunc('+'),
  'times': getCharFunc('*'),
  'left': getCharFunc('('),
  'right': getCharFunc(')'),
  'digit': function(tokens, ret) {
    var isNumber = tokens.length >= 1 && !isNaN(tokens[0]);
    if (isNumber) {
      ret.newTokens = tokens.slice(1);
      ret.structure = tokens[0];
    }
    return isNumber;
  }
};
