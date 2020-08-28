'use strict';

var Js_list = require("bs-platform/lib/js/js_list.js");
var Belt_List = require("bs-platform/lib/js/belt_List.js");
var ArrayLabels = require("bs-platform/lib/js/arrayLabels.js");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");
var Belt_MapString = require("bs-platform/lib/js/belt_MapString.js");
var Belt_SetString = require("bs-platform/lib/js/belt_SetString.js");
var Caml_splice_call = require("bs-platform/lib/js/caml_splice_call.js");

var emptyTree = {
  isWord: false,
  children: undefined
};

function logTree(t, indentN) {
  console.log(" ".repeat(indentN) + String(t.isWord));
  return Belt_MapString.forEach(t.children, (function (k, v) {
                console.log(" ".repeat(indentN) + k);
                return logTree(v, indentN + 2 | 0);
              }));
}

function collectWordsByPrefix(prefix, dict) {
  var letters = ArrayLabels.to_list(prefix.split(""));
  var findSubTree = function (_toRead, _current) {
    while(true) {
      var current = _current;
      var toRead = _toRead;
      if (!toRead) {
        return current;
      }
      var subTree = Belt_MapString.get(current.children, toRead.hd);
      if (subTree === undefined) {
        return ;
      }
      _current = subTree;
      _toRead = toRead.tl;
      continue ;
    };
  };
  var collectAllInSubTree = function (dict, read, acc) {
    var newAcc;
    if (dict.isWord) {
      var w = Caml_splice_call.spliceObjApply("", "concat", [ArrayLabels.of_list(Belt_List.reverse(read))]);
      newAcc = Belt_SetString.add(acc, w);
    } else {
      newAcc = acc;
    }
    var subAccs = Belt_MapString.valuesToArray(Belt_MapString.mapWithKey(dict.children, (function (l, subDict) {
                return collectAllInSubTree(subDict, {
                            hd: l,
                            tl: read
                          }, undefined);
              })));
    return Js_list.foldLeft(Belt_SetString.union, newAcc, ArrayLabels.to_list(subAccs));
  };
  var subTree = findSubTree(letters, dict);
  if (subTree !== undefined) {
    return collectAllInSubTree(subTree, Belt_List.reverse(letters), undefined);
  }
  
}

function addWord(dict, word) {
  var letters = ArrayLabels.to_list(word.split(""));
  var aux = function (toRead, dict) {
    if (!toRead) {
      return {
              isWord: true,
              children: dict.children
            };
    }
    var tail = toRead.tl;
    var l = toRead.hd;
    var subDict = Belt_MapString.get(dict.children, l);
    if (subDict !== undefined) {
      return {
              isWord: dict.isWord,
              children: Belt_MapString.set(dict.children, l, aux(tail, subDict))
            };
    } else {
      return {
              isWord: dict.isWord,
              children: Belt_MapString.set(dict.children, l, aux(tail, {
                        isWord: false,
                        children: undefined
                      }))
            };
    }
  };
  return aux(letters, dict);
}

function buildPrefixTrie(words, idx) {
  console.log("rebuild trie");
  return Js_list.foldLeft(addWord, Belt_Option.getWithDefault(idx, emptyTree), words);
}

exports.emptyTree = emptyTree;
exports.logTree = logTree;
exports.collectWordsByPrefix = collectWordsByPrefix;
exports.addWord = addWord;
exports.buildPrefixTrie = buildPrefixTrie;
/* No side effect */
