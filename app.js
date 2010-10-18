var IRC = require('./vendor/IRC-js/lib/irc');
var joose = require("Joose");
var spawn = require('child_process').spawn;
var fs = require('fs');
var http = require('http');
var sys = require('sys');
var IrcWrapper = require('./vendor/IrcWrapper/lib/IrcWrapper');
require('./vendor/CactusJuice/lib/Addon/Function');
require('./lib/Question');
require('./lib/State');


var state = (function () {
  var state = new State();
  state.addQuestion(new Question({
    question : "What is 1+1?",
    answers : ["2", "two"]
  }));
  state.addQuestion(new Question({
    question : "What is 1-1?",
    answers : ["0", "zero"]
  }));
  return state;
})();

var currentQ = null;

var ircWrapper = new IrcWrapper({
  IRC : IRC,
  server : "irc.vassius.se",
  nick : "triviabot",
  joinChannels : ["#c-test"],
  bindings : {
    join : [{
      callback : function (h) {
      }
    }],
    privmsg : [{
      messageString : "!trivia",
      callback : function (h) {
        if (currentQ !== null) {
          return;
        }
        h.reply("Starting trivia!");
        currentQ = state.getRandomQuestion();
        h.reply(currentQ.getQuestion());
      }
    }, {
      callback : function (h) {
        if (currentQ === null) {
          return;
        }
        if (currentQ.isCorrectAnswer(h.message)) {
          currentQ = null;
          h.reply(h.person.getNick() + " got the right answer!");
        }
      }
    }]
  }
});
