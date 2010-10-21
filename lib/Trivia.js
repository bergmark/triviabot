var Joose = require("Joose");
require('../vendor/CactusJuice/CactusJuice');

var Math = CactusJuice.Addon.Math;
var EventSubscription = CactusJuice.Util.EventSubscription;
var ObjectMap = CactusJuice.Data.ObjectMap;

Joose.Class("Trivia", {
  does : EventSubscription,
  has : {
    currentQuestion : null,
    questions : {
      init : function () { return []; }
    },
    started : {
      is : "ro",
      init : false,
      getterName : "isStarted"
    },
    score : {
      init : function () {
        return new ObjectMap();
      }
    },
    questionNumber : {
      is : "ro"
    }
  },
  methods : {
    // Events.
    onStarted : Function.empty,
    onNewQuestion : Function.empty,
    onStopped : Function.empty,
    onAnswered : Function.empty,
    onTimesUp : Function.empty,

    createQuestion : function (question, answers) {
      this.questions.push(new Question({
        question : question,
        answers : answers
      }));
    },
    _getRandomQuestion : function () {
      return this.questions[Math.rand(0, this.questions.length - 1)];
    },
    newQuestion : function () {
      if (!this.isStarted()) {
        throw new Error("Trivia:newQuestion: Trivia is stopped.");
      }
      this.currentQuestion = this._getRandomQuestion();
      this.questionNumber++;
      this.onNewQuestion();
    },
    hasQuestions : function () {
      return this.questions.length !== 0;
    },
    start : function () {
      if (this.isStarted()) {
        throw new Error("Trivia:start: Trivia is already started.");
      }
      if (!this.hasQuestions()) {
        throw new Error("Trivia:start: Trivia has no questions.");
      }
      this.started = true;
      this.questionNumber = 0;
      this.onStarted();
      this.newQuestion();
    },
    stop : function () {
      if (!this.isStarted()) {
        throw new Error("Trivia:stop: Trivia is already stopped.");
      }
      this.started = false;
      this.onStopped();
    },
    answer : function (person, answer) {
      if (this.currentQuestion.isCorrectAnswer(answer)) {
        this.score.set(person, this.getScore(person) + 1);
        this.onAnswered(person);
        this.newQuestion();
      }
    },
    getScore : function (person) {
      if (this.score.has(person)) {
        return this.score.get(person);
      }
      return 0;
    },
    getCurrentQuestionString : function () {
      if (!this.isStarted()) {
        throw new Error("Trivia:getCurrentQuestionString: Trivia is not started.");
      }
      return this.currentQuestion.getQuestion();
    },
    timesUp : function () {
      this.onTimesUp();
      this.newQuestion();
    }
  }
});
