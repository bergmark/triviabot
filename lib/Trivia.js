require('../vendor/CactusJuice/CactusJuice');

var collection = CactusJuice.Data.Collection;
var Math = CactusJuice.Addon.Math;
var EventSubscription = CactusJuice.Util.EventSubscription;
var ObjectMap = CactusJuice.Data.ObjectMap;
var object = CactusJuice.Addon.Object;

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
    },
    unansweredStreak : {
      init : 0
    },
    stopAfterUnansweredStreak : {
      is : "rw",
      init : 10
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
      this.unansweredStreak = 0;
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
    getQuestionCount : function () {
      return this.questions.length;
    },
    timesUp : function () {
      this.onTimesUp();
      this.unansweredStreak++;
      if (this.unansweredStreak < this.stopAfterUnansweredStreak) {
        this.newQuestion();
      } else {
        this.stop();
      }
    },
    serialize : function () {
      return {
        questions : collection.map(this.questions,
                                   function (q) { return q.serialize(); }),
        score : this.score.toHash()
      };
    }
  }
});
Trivia.unserialize = function (hash, options) {
  options = options || {};
  options.personUnserializer = options.personUnserializer || function (v) { return v; };
  var trivia = new Trivia();
  collection.each(hash.questions, function (q) {
    trivia.questions.push(Question.unserialize(q));
  });
  collection.each(hash.score, function (a) {
    trivia.score.set(options.personUnserializer(a[0]), a[1]);
  });
  return trivia;
};
