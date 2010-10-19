require('../triviabot.js');

module.exports = (function () {
  return {
    test : function (assert) {
      var q = new Question({
        question : "What is 1+1?",
        answers : ["2", "two"]
      });
      assert.eql("What is 1+1?", q.getQuestion());
      assert.ok(q.isCorrectAnswer("2"));
      assert.ok(q.isCorrectAnswer("two"));
      assert.ok(!q.isCorrectAnswer("3"));
    }
  };
})();
