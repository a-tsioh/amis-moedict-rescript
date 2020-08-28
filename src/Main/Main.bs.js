'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Js_json = require("bs-platform/lib/js/js_json.js");
var ArrayLabels = require("bs-platform/lib/js/arrayLabels.js");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");
var Menu$AmisMoedictRescript = require("../Menu/Menu.bs.js");
var Trie$AmisMoedictRescript = require("../Storage/Trie.bs.js");
var WordView$AmisMoedictRescript = require("../WordView/WordView.bs.js");
var SearchResults$AmisMoedictRescript = require("../SearchResults/SearchResults.bs.js");

function populateIndex(s) {
  if (typeof s === "number") {
    return ;
  }
  switch (s.TAG | 0) {
    case /* HasM */0 :
    case /* HasMandS */1 :
        return ;
    case /* HasIndex */2 :
        return s._0;
    
  }
}

function Main(Props) {
  var match = React.useState(function () {
        return /* LoadingIndex */0;
      });
  var setState = match[1];
  var s = match[0];
  var match$1 = React.useState(function () {
        return "";
      });
  var match$2 = React.useState(function () {
        return "";
      });
  var fetchOne = function (url, existingIndex, nextState) {
    console.log(url);
    fetch(url).then(function (prim) {
                    return prim.json();
                  }).then(function (json) {
                  return Promise.resolve(Js_json.decodeArray(json));
                }).then(function (opt) {
                return Promise.resolve(Belt_Option.getExn(opt));
              }).then(function (items) {
              return Promise.resolve(items.map(function (i) {
                              return Belt_Option.getExn(Js_json.decodeString(i));
                            }));
            }).then(function (wordList) {
            Curry._1(setState, (function (_previousState) {
                    return Curry._1(nextState, Trie$AmisMoedictRescript.buildPrefixTrie(ArrayLabels.to_list(wordList), existingIndex));
                  }));
            return Promise.resolve(undefined);
          }).catch(function (_err) {
          Curry._1(setState, (function (_previousState) {
                  return /* Error */1;
                }));
          return Promise.resolve(undefined);
        });
    
  };
  React.useEffect((function () {
          if (typeof s === "number") {
            if (s !== /* LoadingIndex */0) {
              return ;
            }
            console.log("refetch");
            fetchOne("./statics/data/m/index.json", undefined, (function (i) {
                    return {
                            TAG: /* HasM */0,
                            _0: i
                          };
                  }));
            return ;
          } else {
            switch (s.TAG | 0) {
              case /* HasM */0 :
                  fetchOne("./statics/data/s/index.json", s._0, (function (i) {
                          return {
                                  TAG: /* HasMandS */1,
                                  _0: i
                                };
                        }));
                  return ;
              case /* HasMandS */1 :
                  fetchOne("./statics/data/p/index.json", s._0, (function (i) {
                          return {
                                  TAG: /* HasIndex */2,
                                  _0: i
                                };
                        }));
                  return ;
              case /* HasIndex */2 :
                  return ;
              
            }
          }
        }), [s]);
  return React.createElement("div", {
              style: {
                width: "100%"
              }
            }, React.createElement(Menu$AmisMoedictRescript.make, {
                  placeholder: "Search for a word",
                  onSearchChange: match$1[1]
                }), React.createElement("div", {
                  className: "ui grid"
                }, React.createElement("div", {
                      className: "four wide column"
                    }, React.createElement(SearchResults$AmisMoedictRescript.make, {
                          data: populateIndex(s),
                          query: match$1[0],
                          onClickWord: match$2[1]
                        })), React.createElement("div", {
                      className: "twelve wide column"
                    }, React.createElement(WordView$AmisMoedictRescript.make, {
                          word: match$2[0]
                        }))));
}

var make = Main;

exports.populateIndex = populateIndex;
exports.make = make;
/* react Not a pure module */
