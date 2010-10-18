require('Question');

module.exports = (function () {
  return {
    test : function (assert) {
      var q = new Question({
        question : "What is 1+1?",
        answer : "2"
      });
      assert.eql("What is 1+1?", q.getQuestion());
      assert.ok(q.isCorrectAnswer("2"));
      assert.ok(!q.isCorrectAnswer("3"));
    }
  };
})();
