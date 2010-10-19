var IRC = require('./vendor/IRC-js/lib/irc');
var IrcWrapper = require('./vendor/IrcWrapper/lib/IrcWrapper');
require('./vendor/CactusJuice/CactusJuice');
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

Class("S", {
  has : {
    currentQuestion : {
      is : "ro",
      init : null
    },
    i : {
      is : "ro",
      init : 0
    }
  }, methods : {
    nextQuestion : function () {
      this.currentQuestion = state._getRandomQuestion();
      this.i++;
    },
    isRunning : function () {
      return this.currentQuestion !== null;
    }
  }
});
var s = new S();

