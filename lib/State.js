var Joose = require("Joose");
require('../vendor/CactusJuice/CactusJuice');

var Math = CactusJuice.Addon.Math;
var EventSubscription = CactusJuice.Util.EventSubscription;

Joose.Class("State", {
  does : EventSubscription,
  has : {
    questions : {
      init : function () { return []; }
    },
    triviaStarted : {
      is : "ro",
      init : false
    }
  },
  methods : {
    // Events.
    onTriviaStart : Function.empty(),
    onNewQuestion : Function.empty(),

    addQuestion : function (q) {
      this.questions.push(q);
    },
    _getRandomQuestion : function () {
      return this.questions[Math.rand(0, this.questions.length - 1)];
    },
    startTrivia : function () {
      if (this.started) {
        throw new Error("State:startTrivia: Trivia is already started.");
      }
      this.started = true;
      this.onTriviaStart();
      this.onNewQuestion();
    }
  }
});
