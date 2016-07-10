/******************\
|     Language     |
|     Grammar      |
| @author Anthony  |
| @version 0.1     |
| @date 2016/07/07 |
| @edit 2016/07/08 |
\******************/

var LanguageGrammar = (function() {
  // helper functions
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
  
  function getStringFunc(str) {
    return function(tokens, ret) {
      if (tokens.length >= str.length) {
        var attempt = tokens.slice(0, str.length).join('');
        if (attempt === str) {
          ret.newTokens = tokens.slice(str.length);
          ret.structure = str;
          return true;
        }
      }
      return false;
    };
  }

  // grammar rules
  return {
    // higher level language concepts
    'program': '[ extendedSpace ], statements, [ extendedSpace ]',
    'statements': 'statement, { newlineStatement }',
    'newlineStatement': '\
      spaceNewlineSpace, [ extendedSpace ], statement \
    ',
    'statement': 'ifElse | if | declaration',
    'ifElse': '\
      boolExpression, [ space ], block, [ extendedSpace ], \
      elseWord, [ space ], block \
    ',
    'if': 'boolExpression, [ space ], block',
    'block': '\
      leftBrace, [ extendedSpace ], statements, \
      [ extendedSpace ], rightBrace \
    ',
    'declaration': '\
      declare, [ space ], identifier, [ space ], \
      eq, [ space ], numExpression \
    ',

    // boolean expressions
    'boolExpression': 'boolTerm, { orBoolTerm }',
    'orBoolTerm': 'space, or, space, boolTerm',
    'boolTerm': 'boolGroup, { andBoolGroup }',
    'andBoolGroup': 'space, and, space, boolGroup',
    'boolGroup': '\
      numExpression, [ space ], binBoolOp, [ space ], numExpression | \
      identifier | \ 
      left, [ space ], boolExpression, [ space ], right \
    ',
    'binBoolOp': 'lt | gt | eqeq | notEq',

    // numeric expressions
    'numExpression': 'term, { plusTerm }',
    'plusTerm': '[ space ], plus, [ space ], term',
    'term': 'group, { timesGroup }',
    'timesGroup': '[ space ], times, [ space ], group',
    'group': '\
      number | identifier | left, [ space ], numExpression, [ space ] right \
    ',
    
    // keywords
    'elseWord': getCharFunc(':'),
    'and': getStringFunc('and'),
    'or': getStringFunc('or'),
    'declare': getStringFunc('let'),
    // moves: >>>, vvv, <<<, ^^^
    // rotates: @, counter clockwise, @@@, clockwise
    // ??? message, logs message to console

    // basic helpers
    'identifier': 'letter, { alphanum }',
    'number': 'nonzeroDigit, { digit }',
    'extendedSpace': 'spaceNewlineSpace+ | space',
    'spaceNewlineSpace': '[ space ], newline, [ space ]',
    'space': 'blankChar, { blankChar }',
    'blankChar': function(tokens, ret) {
      var isBlank = tokens.length >= 1 && tokens[0].match(
        /^[ \t]/
      ) !== null;
      if (isBlank) {
        ret.newTokens = tokens.slice(1);
        ret.structure = tokens[0];
      }
      return isBlank;
    },
    'alphanum': 'letter | digit',

    // fundamental building blocks (terminals)
    'eqeq': getStringFunc('=='),
    'notEq': getStringFunc('!='),
    'lt': getCharFunc('<'),
    'gt': getCharFunc('>'),
    'plus': getCharFunc('+'),
    'times': getCharFunc('*'),
    'left': getCharFunc('('),
    'right': getCharFunc(')'),
    'leftBrace': getCharFunc('{'),
    'rightBrace': getCharFunc('}'),
    'semicolon': getCharFunc(';'),
    'spaceChar': getCharFunc(' '),
    'newline': getCharFunc('\n'), // TODO: pay attn to \r for newlines
    'eq': getCharFunc('='),
    'letter': function(tokens, ret) {
      if (tokens.length < 1) return false;

      var letter = tokens[0].toLowerCase();
      var isLetter = letter >= 'a' && letter <= 'z';
      if (isLetter) {
        ret.newTokens = tokens.slice(1);
        ret.structure = tokens[0];
      }
      return isLetter;
    },
    'nonzeroDigit': function(tokens, ret) {
      if (tokens.length < 1) return false;

      var isNumber = tokens[0] >= '1' && tokens[0] <= '9';
      if (isNumber) {
        ret.newTokens = tokens.slice(1);
        ret.structure = tokens[0];
      }
      return isNumber;
    },
    'digit': function(tokens, ret) {
      if (tokens.length < 1) return false;

      var isNumber = tokens[0] >= '0' && tokens[0] <= '9';
      if (isNumber) {
        ret.newTokens = tokens.slice(1);
        ret.structure = tokens[0];
      }
      return isNumber;
    }
  };
})();

