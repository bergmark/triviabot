var IRC = require('./vendor/IRC-js/lib/irc');
var joose = require("Joose");
var spawn = require('child_process').spawn;
var fs = require('fs');
var http = require('http');
var sys = require('sys');
var IrcWrapper = require('./vendor/IrcWrapper/lib/IrcWrapper');
require('./vendor/CactusJuice/lib/Addon/Function');

var ircWrapper = new IrcWrapper({
  IRC : IRC,
  server : "irc.vassius.se",
  nick : "triviabot",
  joinChannels : ["#c-test"],
  bindings : {
    join : [{
      callback : function (h) {
      }
    }]
  }
});
