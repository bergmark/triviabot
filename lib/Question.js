var Joose = require('Joose');

Joose.Class("Question", {
  has : {
    question : {
      is : "ro"
    },
    answer : null
  },
  methods : {
    isCorrectAnswer : function (answer) {
      return this.answer === answer;
    }
  }
});
