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
    },
    serialize : function (assert) {
      var q = new Question({
        question : "foo",
        answers : ["bar", "baz"]
      });
      assert.eql('{"question":"foo","answers":["bar","baz"]}', JSON.stringify(q.serialize()));
    },
    unserialize : function (assert) {
      var q = Question.unserialize({
        question : "foo",
        answers : ["bar", "baz"]
      });
      assert.eql("foo", q.getQuestion());
      assert.ok(q.isCorrectAnswer("bar"));
      assert.ok(q.isCorrectAnswer("baz"));
    }
  };
})();
