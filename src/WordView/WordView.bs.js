'use strict';

var React = require("react");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");
var EntryView$AmisMoedictRescript = require("./EntryView.bs.js");

function WordView(Props) {
  var word = Props.word;
  var match = React.useState(function () {
        
      });
  var setStem = match[1];
  return React.createElement("div", {
              className: "ui segment"
            }, React.createElement("h1", undefined, word), React.createElement("h3", undefined, Belt_Option.getWithDefault(Belt_Option.map(match[0], (function (s) {
                            return "(詞幹:" + (s + ")");
                          })), "")), React.createElement(EntryView$AmisMoedictRescript.make, {
                  word: word,
                  dict: "s",
                  dictName: "蔡中涵大辭典",
                  color: "blue",
                  setStem: setStem
                }), React.createElement(EntryView$AmisMoedictRescript.make, {
                  word: word,
                  dict: "p",
                  dictName: "方敏英字典",
                  color: "teal",
                  setStem: setStem
                }), React.createElement(EntryView$AmisMoedictRescript.make, {
                  word: word,
                  dict: "m",
                  dictName: "潘世光阿法",
                  color: "grey",
                  setStem: setStem
                }));
}

var make = WordView;

exports.make = make;
/* react Not a pure module */
