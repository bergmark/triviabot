require('../triviabot');

module.exports = (function () {
  return {
    "save questions" : function (assert) {
      var trivia = new Trivia();
      var repository = new TriviaRepository({
        filePath : "./testfiles/storage.txt",
        trivia : trivia
      });
      trivia.createQuestion("What is 3/2?", ["1.5", "1,5"]);
      repository.save(trivia);
      var trivia2 = repository.load();
      assert.eql(1, trivia2.getQuestionCount());
    }
  };
})();
