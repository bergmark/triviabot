var assert = require('assert');
require('../triviabot');

module.exports = (function () {
  return {
    "save questions" : function () {
      var trivia = new Trivia();
      var repository = new TriviaRepository({
        filePath : "./testfiles/storage.txt",
        trivia : trivia
      });
      trivia.createQuestion("What is 3/2?", ["1.5", "1,5"]);
      repository.save(trivia);
      var trivia2 = repository.load();
      assert.eql(1, trivia2.getQuestionCount());
    },
    "save score" : function () {
      var trivia = new Trivia();
      var repository = new TriviaRepository({
        filePath : "./testfiles/storage.txt",
        trivia : trivia
       });
      trivia.createQuestion("What is 1+1?", ["2"]);
      trivia.start();
      trivia.answer("me", "2");
      trivia.answer("me", "2");
      trivia.answer("you", "2");
      repository.save(trivia);
      var trivia2 = repository.load();
      assert.eql(2, trivia2.getScore("me"));
      assert.eql(1, trivia2.getScore("you"));
    }
  };
})();
