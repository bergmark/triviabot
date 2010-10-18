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

      // Don't rand an index outside of the array.
      // This would probably break...
      assert.isDefined(state.getRandomQuestion());
      assert.isDefined(state.getRandomQuestion());
      assert.isDefined(state.getRandomQuestion());
      assert.isDefined(state.getRandomQuestion());

      state.addQuestion(new Question({
        question : "What is 0-0?",
        answers : ["0", "zero"]
      }));
    }
  };
})();
