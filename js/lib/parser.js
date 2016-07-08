/******************\
|  General Parser  |
| @author Anthony  |
| @version 1.1     |
| @date 2016/06/17 |
| @edit 2016/06/17 |
\******************/

var Parser = (function() {

  // config
  var DEBUG = false;
  
  function applyBuiltIn(rules, structures, type, components, tokens, ret) {
    var tempTokens = tokens.slice(0);
    ret.newTokens = tokens.slice(0);
    var doubleRet = {};
    var structureList = [];
    switch (type) {
      case 'or':
        for (var i = 0; i < components.length; i++) {
          if (ruleApplies(rules, structures, components[i], tokens, ret)) {
            ret.which = i;
            return true;
          }
        }
        return false;
      case 'and':
        for (var i = 0; i < components.length; i++) {
          if (ruleApplies(rules, structures, components[i], tempTokens, doubleRet)) {
            tempTokens = doubleRet.newTokens;
            structureList.push(doubleRet.structure);
          } else return false;
        }
        ret.newTokens = tempTokens;
        ret.structure = structureList;
        return true;
      case 'repeat':
        if (components.length !== 3) return false;
        
        var min = components[0], max = components[1], rule = components[2];
        for (var counter = 0; counter < max; counter++) {
          if (ruleApplies(rules, structures, rule, tempTokens, doubleRet)) {
            tempTokens = doubleRet.newTokens;
            structureList.push(doubleRet.structure);
          } else break;
        }
  
        if (counter >= min) {
          ret.newTokens = tempTokens;
          ret.structure = structureList;
          return true;
        }
    }
  
    return false;
  }
  
  function ruleApplies(rules, structures, rule, tokens, ret) {
    var struct = typeof rule === 'string' ? rules[rule] : rule;
  
    // apply the rule
    var applies = false;
    switch (typeof struct) {
      case 'function':
        applies = struct(tokens, ret);
        break;
      case 'object':
        var builtIn = Object.keys(struct);
        if (builtIn.length > 0) {
          applies = applyBuiltIn(rules, structures, builtIn[0], struct[builtIn[0]], tokens, ret);
        }
        break;
      case 'string':
        applies = ruleApplies(rules, structures, struct, tokens, ret);
        break;
    }
  
    // apply the structural transformation
    if (applies && typeof rule === 'string') {
      var transform = structures[rule];
      if (typeof transform === 'object') transform = transform[ret.which];
      ret.structure = transform.call(this, ret.structure);
    }
  
    if (applies && DEBUG) console.log(rule, ':', tokens, JSON.stringify(ret.structure));
  
    return applies;
  }
  
  function parse(rules, structures, goal, tokens) {
    var ret = {};
    var conformsToRule = ruleApplies(rules, structures, goal, tokens, ret);
    if (conformsToRule && ret.newTokens.length === 0) return ret.structure;
    else return false;
  }
  
  return {
    parse: parse
  };
})();
