require('../vendor/IrcWrapper/mock/IRCMock');
require('../vendor/IrcWrapper/lib/IrcWrapper');

require('../triviabot');

module.exports = (function () {
  var Assertion = CactusJuice.Dev.Assertion;
  return {
    test : function (assert) {
      var assertException = Assertion.exception.bind(Assertion, assert);
      var trivia = new Trivia();
      trivia.addQuestion(new Question({
        question : "What is 1+1?",
        answers : ["2", "two"]
      }));

      // Don't rand an index outside of the array.
      // This would probably break...
      assert.isDefined(trivia._getRandomQuestion());
      assert.isDefined(trivia._getRandomQuestion());
      assert.isDefined(trivia._getRandomQuestion());
      assert.isDefined(trivia._getRandomQuestion());

      trivia.addQuestion(new Question({
        question : "What is 0-0?",
        answers : ["0", "zero"]
      }));

      var events = [];
      var startTriggers = 0;
      var newQuestionTriggers = 0;
      trivia.subscribe("Started", function () {
        startTriggers++;
        events.push("Started");
      });
      trivia.subscribe("NewQuestion", function () {
        // Current question should be set when trivia starts.
        assert.ok(trivia.getCurrentQuestion() instanceof Question);
        newQuestionTriggers++;
        events.push("NewQuestion");
      });
      trivia.start();
      assert.eql(1, startTriggers);
      assertException(/trivia is already started/i, trivia.start.bind(trivia));
      assert.eql(1, startTriggers);
      assert.eql(1, newQuestionTriggers);

      // Send Start before NewQuestion.
      assert.eql("Started", events[0]);
      assert.eql("NewQuestion", events[1]);

      var triggered = false;
      trivia.subscribe("NewQuestion", function () {
        triggered = true;
        assert.ok(trivia.getCurrentQuestion() instanceof Question);
      });
      trivia.newQuestion();
      assert.eql(2, newQuestionTriggers);
      assert.ok(triggered);

      trivia = new Trivia();

      // Need to have questions added before starting.
      assert.ok(!trivia.hasQuestions());
      assertException(/:start:.+has no questions/i, trivia.start.bind(trivia));

      // Stopping.
      trivia = new Trivia();
      assert.ok(!trivia.isStarted());
      trivia.addQuestion(new Question({
        question : "What is 2*2?",
        answers : ["4", "four"]
      }));
      trivia.start();
      assert.ok(trivia.isStarted());
      var stoppedTriggered = false;
      trivia.subscribe("Stopped", function () {
        stoppedTriggered = true;
      });
      trivia.stop();
      assert.ok(!trivia.isStarted());
      assert.ok(stoppedTriggered);

      assertException(/:stop:.+already stopped/i, trivia.stop.bind(trivia));

      assertException(/:newQuestion:.+is stopped/i, trivia.newQuestion.bind(trivia));
    },
    scores : function (assert) {
      var trivia = new Trivia();
      trivia.addQuestion(new Question({
        question : "What is 3/2?",
        answers : ["1.5", "1,5"]
      }));

      trivia.start();
      trivia.answer("me", "1");
      trivia.answer("me", "1.5");
      assert.eql(1, trivia.getScore("me"));
      trivia.answer("me", "1.5");
      assert.eql(2, trivia.getScore("me"));
      assert.eql(0, trivia.getScore("other"));
    }
  };
})();