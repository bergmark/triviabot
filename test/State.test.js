require('../vendor/IrcWrapper/mock/IRCMock');
require('../vendor/IrcWrapper/lib/IrcWrapper');

require('../triviabot');

module.exports = (function () {
  var Assertion = CactusJuice.Dev.Assertion;
  return {
    test : function (assert) {
      var assertException = Assertion.exception.bind(Assertion, assert);
      var state = new State();
      state.addQuestion(new Question({
        question : "What is 1+1?",
        answers : ["2", "two"]
      }));

      // Don't rand an index outside of the array.
      // This would probably break...
      assert.isDefined(state._getRandomQuestion());
      assert.isDefined(state._getRandomQuestion());
      assert.isDefined(state._getRandomQuestion());
      assert.isDefined(state._getRandomQuestion());

      state.addQuestion(new Question({
        question : "What is 0-0?",
        answers : ["0", "zero"]
      }));

      var events = [];
      var startTriggers = 0;
      var newQuestionTriggers = 0;
      state.subscribe("TriviaStart", function () {
        startTriggers++;
        events.push("TriviaStart");
      });
      state.subscribe("NewQuestion", function () {
        newQuestionTriggers++;
        events.push("NewQuestion");
      });
      state.startTrivia();
      assert.eql(1, startTriggers);
      assertException(/trivia is already started/i, state.startTrivia.bind(state));
      assert.eql(1, startTriggers);
      assert.eql(1, newQuestionTriggers);
      // Send TriviaStart before NewQuestion.
      assert.eql("TriviaStart", events[0]);
      assert.eql("NewQuestion", events[1]);

    }
  };
})();
