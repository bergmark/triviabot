var Joose = require("Joose");
require('../vendor/CactusJuice/CactusJuice');

var Math = CactusJuice.Addon.Math;
var EventSubscription = CactusJuice.Util.EventSubscription;

Joose.Class("State", {
  does : EventSubscription,
  has : {
    currentQuestion : {
      is : "ro"
    },
    questions : {
      init : function () { return []; }
    },
    started : {
      is : "ro",
      init : false,
      getterName : "isStarted"
    }
  },
  methods : {
    // Events.
    onStarted : Function.empty,
    onNewQuestion : Function.empty,
    onStopped : Function.empty,

    addQuestion : function (q) {
      this.questions.push(q);
    },
    _getRandomQuestion : function () {
      return this.questions[Math.rand(0, this.questions.length - 1)];
    },
    newQuestion : function () {
      if (!this.isStarted()) {
        throw new Error("State:newQuestion: Trivia is stopped.");
      }
      this.currentQuestion = this._getRandomQuestion();
      this.onNewQuestion();
    },
    hasQuestions : function () {
      return this.questions.length !== 0;
    },
    start : function () {
      if (this.isStarted()) {
        throw new Error("State:start: Trivia is already started.");
      }
      if (!this.hasQuestions()) {
        throw new Error("State:start: Trivia has no questions.");
      }
      this.started = true;
      this.onStarted();
      this.newQuestion();
    },
    stop : function () {
      if (!this.isStarted()) {
        throw new Error("State:stop: Trivia is already stopped.");
      }
      this.started = false;
      this.onStopped();
    }
  }
});
