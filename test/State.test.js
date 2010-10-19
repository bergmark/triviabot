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
      state.subscribe("Started", function () {
        startTriggers++;
        events.push("Started");
      });
      state.subscribe("NewQuestion", function () {
        // Current question should be set when trivia starts.
        assert.ok(state.getCurrentQuestion() instanceof Question);
        newQuestionTriggers++;
        events.push("NewQuestion");
      });
      state.start();
      assert.eql(1, startTriggers);
      assertException(/trivia is already started/i, state.start.bind(state));
      assert.eql(1, startTriggers);
      assert.eql(1, newQuestionTriggers);

      // Send Start before NewQuestion.
      assert.eql("Started", events[0]);
      assert.eql("NewQuestion", events[1]);

      var triggered = false;
      state.subscribe("NewQuestion", function () {
        triggered = true;
        assert.ok(state.getCurrentQuestion() instanceof Question);
      });
      state.newQuestion();
      assert.eql(2, newQuestionTriggers);
      assert.ok(triggered);

      state = new State();

      // Need to have questions added before starting.
      assert.ok(!state.hasQuestions());
      assertException(/:start:.+has no questions/i, state.start.bind(state));

      // Stopping.
      state = new State();
      assert.ok(!state.isStarted());
      state.addQuestion(new Question({
        question : "What is 2*2?",
        answers : ["4", "four"]
      }));
      state.start();
      assert.ok(state.isStarted());
      var stoppedTriggered = false;
      state.subscribe("Stopped", function () {
        stoppedTriggered = true;
      });
      state.stop();
      assert.ok(!state.isStarted());
      assert.ok(stoppedTriggered);

      assertException(/:stop:.+already stopped/i, state.stop.bind(state));

      assertException(/:newQuestion:.+is stopped/i, state.newQuestion.bind(state));
    }
  };
})();
