'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");

function Menu(Props) {
  var placeholder = Props.placeholder;
  var onSearchChange = Props.onSearchChange;
  return React.createElement("div", {
              className: "ui menu"
            }, React.createElement("div", {
                  className: "item"
                }, React.createElement("div", {
                      className: "ui icon input"
                    }, React.createElement("input", {
                          placeholder: placeholder,
                          type: "text",
                          onChange: (function (e) {
                              return Curry._1(onSearchChange, e.target.value);
                            })
                        }), React.createElement("i", {
                          className: "search icon"
                        }))), React.createElement("div", {
                  className: "right item"
                }, "Coucou"));
}

var make = Menu;

exports.make = make;
/* react Not a pure module */
