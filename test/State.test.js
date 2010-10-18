require('Question');
require('State');

module.exports = (function () {
  return {
    test : function (assert) {
      var state = new State();
      state.addQuestion(new Question({
        question : "What is 1+1?",
        answers : ["2", "two"]
      }));
      state.addQuestion(new Question({
        question : "What is 0-0?",
        answers : ["0", "zero"]
      }));
    }
  };
})();
