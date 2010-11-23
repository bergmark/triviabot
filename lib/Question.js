var collection = CactusJuice.Data.Collection;

Joose.Class("Question", {
  has : {
    question : {
      is : "ro"
    },
    answers : {
      init : function () { return []; }
    }
  },
  methods : {
    isCorrectAnswer : function (answer) {
      return collection.hasValue(this.answers, answer);
    },
    serialize : function () {
      return {
        question : this.question,
        answers : this.answers
      };
    }
  }
});
Question.unserialize = function (hash) {
  return new Question(hash);
};
