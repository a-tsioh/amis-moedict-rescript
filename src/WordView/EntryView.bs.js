'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Js_dict = require("bs-platform/lib/js/js_dict.js");
var Js_json = require("bs-platform/lib/js/js_json.js");
var Belt_Option = require("bs-platform/lib/js/belt_Option.js");

function decodeOptionArrayString(json) {
  return Belt_Option.map(Js_json.decodeArray(json), (function (a) {
                return a.map(function (x) {
                            return Belt_Option.getWithDefault(Js_json.decodeString(x), "");
                          });
              }));
}

function decodeDefinition(json) {
  var def = Belt_Option.getExn(Js_json.decodeObject(json));
  return {
          glose: String(def["f"]),
          examples: decodeOptionArrayString(def["e"]),
          synonyms: decodeOptionArrayString(def["s"]),
          references: decodeOptionArrayString(def["r"]),
          type_: Belt_Option.flatMap(Js_dict.get(def, "t"), Js_json.decodeString)
        };
}

function decodeHet(json) {
  var h = Belt_Option.getExn(Js_json.decodeObject(json));
  return {
          name: Belt_Option.map(Js_dict.get(h, "name"), (function (prim) {
                  return String(prim);
                })),
          defs: Belt_Option.getWithDefault(Belt_Option.map(Belt_Option.flatMap(Js_dict.get(h, "d"), Js_json.decodeArray), (function (param) {
                      return $$Array.map(decodeDefinition, param);
                    })), [])
        };
}

function decodeEntry(json) {
  return Belt_Option.map(Js_json.decodeObject(json), (function (obj) {
                return {
                        term: Belt_Option.getWithDefault(Belt_Option.map(Js_dict.get(obj, "t"), (function (prim) {
                                    return String(prim);
                                  })), "???"),
                        stem: Belt_Option.map(Js_dict.get(obj, "stem"), (function (prim) {
                                return String(prim);
                              })),
                        tag: undefined,
                        het: Belt_Option.getWithDefault(Belt_Option.map(Belt_Option.flatMap(Js_dict.get(obj, "h"), Js_json.decodeArray), (function (param) {
                                    return $$Array.map(decodeHet, param);
                                  })), [])
                      };
              }));
}

function EntryView(Props) {
  var word = Props.word;
  var dict = Props.dict;
  var dictName = Props.dictName;
  var color = Props.color;
  var setStem = Props.setStem;
  var match = React.useState(function () {
        return /* Init */0;
      });
  var setState = match[1];
  var s = match[0];
  var fetchEntry = function (param) {
    var url = "./statics/data/" + (dict + ("/" + (word + ".json")));
    fetch(url).then(function (prim) {
              return prim.json();
            }).then(function (json) {
            console.log(json);
            var e = decodeEntry(json);
            if (e !== undefined) {
              console.log(e);
              Curry._1(setState, (function (param) {
                      return /* Fetched */{
                              _0: e
                            };
                    }));
            }
            return Promise.resolve(undefined);
          }).catch(function (_err) {
          Curry._1(setState, (function (_previousState) {
                  return /* Error */1;
                }));
          return Promise.resolve(undefined);
        });
    
  };
  React.useEffect((function () {
          fetchEntry(undefined);
          
        }), [word]);
  React.useEffect((function () {
          if (typeof s !== "number") {
            var s$1 = s._0.stem;
            if (s$1 !== undefined) {
              Curry._1(setStem, (function (param) {
                      return s$1;
                    }));
            }
            
          }
          
        }), [s]);
  return React.createElement("div", {
              className: "ui container segment"
            }, React.createElement("div", {
                  className: "ui large " + (color + " top attached label")
                }, dictName), typeof s === "number" ? React.createElement("div", {
                    className: "ui message"
                  }, "not found") : React.createElement("div", {
                    className: "ui list"
                  }, $$Array.mapi((function (hi, h) {
                          return React.createElement("div", {
                                      key: String(hi),
                                      className: "item"
                                    }, React.createElement("div", {
                                          className: "ui ordered list"
                                        }, $$Array.mapi((function (di, d) {
                                                var examples = d.examples;
                                                return React.createElement("div", {
                                                            key: String(di),
                                                            className: "item"
                                                          }, React.createElement("div", {
                                                                className: "header"
                                                              }, d.glose), React.createElement("div", {
                                                                className: "content"
                                                              }, React.createElement("div", {
                                                                    className: "ui bullet list"
                                                                  }, examples !== undefined ? $$Array.mapi((function (exi, ex) {
                                                                            return React.createElement("div", {
                                                                                        key: String(exi),
                                                                                        className: "item"
                                                                                      }, ex);
                                                                          }), examples) : React.createElement("div", undefined))));
                                              }), h.defs)));
                        }), s._0.het)));
}

var make = EntryView;

exports.decodeOptionArrayString = decodeOptionArrayString;
exports.decodeDefinition = decodeDefinition;
exports.decodeHet = decodeHet;
exports.decodeEntry = decodeEntry;
exports.make = make;
/* react Not a pure module */
