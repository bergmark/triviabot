var assert = require('assert');
require('../triviabot');

module.exports = (function () {
  var Assertion = CactusJuice.Dev.Assertion;

  function createSampleTrivia(options) {
    var trivia = new Trivia(options);
    trivia.createQuestion("What is 3/2?", ["1.5", "1,5"]);
    return trivia;
  }

  return {
    test : function () {
      var assertException = Assertion.exception.bind(Assertion, assert);
      var trivia = new Trivia();
      trivia.createQuestion("What is 1+1?", ["2", "two"]);
      assert.eql(1, trivia.getQuestionCount());

      // Don't rand an index outside of the array.
      // This would probably break...
      assert.isDefined(trivia._getRandomQuestion());
      assert.isDefined(trivia._getRandomQuestion());
      assert.isDefined(trivia._getRandomQuestion());
      assert.isDefined(trivia._getRandomQuestion());

      trivia.createQuestion("What is 0-0?", ["0", "zero"]);

      var events = [];
      var startTriggers = 0;
      var newQuestionTriggers = 0;
      trivia.subscribe("Started", function () {
        startTriggers++;
        events.push("Started");
      });

      // Can only get question string if trivia is started.
      assertException(/:getCurrentQuestionString:.+not started/i, trivia.getCurrentQuestionString.bind(trivia));

      trivia.subscribe("NewQuestion", function () {
        // Current question should be set when trivia starts.
        assert.ok(typeof trivia.getCurrentQuestionString() === "string");
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
        assert.ok(typeof trivia.getCurrentQuestionString() === "string");
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
      trivia.createQuestion("What is 2*2?", ["4", "four"]);
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
    answering : function () {
      var trivia = createSampleTrivia();
      trivia.start();
      var answeredTriggered = false;
      trivia.subscribe("Answered", function (trivia, person) {
        assert.eql("me", person);
        answeredTriggered = true;
      });
      trivia.answer("me", "1.5");
      assert.ok(answeredTriggered);
    },
    score : function () {
      var trivia = createSampleTrivia();
      trivia.start();
      trivia.answer("me", "1");
      trivia.answer("me", "1.5");
      assert.eql(1, trivia.getScore("me"));
      trivia.answer("me", "1.5");
      assert.eql(2, trivia.getScore("me"));
      assert.eql(0, trivia.getScore("other"));
    },
    "question number" : function () {
      var trivia = createSampleTrivia();
      trivia.start();
      assert.eql(1, trivia.getQuestionNumber());
      trivia.answer("me", "1.5");
      assert.eql(2, trivia.getQuestionNumber());
    },
    "times up" : function () {
      var trivia = createSampleTrivia();
      var newQuestionTriggers = 0;
      trivia.subscribe("NewQuestion", function () {
        newQuestionTriggers++;
      });
      var timesUpTriggers = 0;
      trivia.subscribe("TimesUp", function () {
        timesUpTriggers++;
      });
      trivia.start();
      assert.eql(1, newQuestionTriggers);
      trivia.timesUp();
      assert.eql(1, timesUpTriggers);
      assert.eql(2, newQuestionTriggers);
    },
    "stop after unanswered streak" : function () {
      var trivia = createSampleTrivia({
        stopAfterUnansweredStreak : 3
      });
      var stoppedTriggered = false;
      trivia.subscribe("Stopped", function () {
        stoppedTriggered = true;
      });
      trivia.start();
      trivia.timesUp();
      trivia.timesUp();
      assert.ok(!stoppedTriggered, "Premature stop.");
      trivia.timesUp();
      assert.ok(stoppedTriggered, "Did not stop.");
      // Reset counter after stop.
      stoppedTriggered = false;
      trivia.start();
      trivia.timesUp();
      assert.ok(!stoppedTriggered, "Premature stop after restart.");
    },
    serialize : function () {
      var trivia = new Trivia();
      trivia.createQuestion("foo", ["bar", "baz"]);
      trivia.start();
      trivia.answer("me", "bar");
      var h = trivia.serialize();
      assert.eql('[{"question":"foo","answers":["bar","baz"]}]',
                JSON.stringify(h.questions));
      assert.eql(1, h.score[0][1]);
    },
    unserialize : function () {
      var trivia = Trivia.unserialize({
        questions : [{
          question : "foo",
          answers : ["bar", "baz"]
        }, {
          question : "what is 1+1?",
          answers : ["2", "two"]
        }],
        score : [
          ["me", 1]
        ]
      });
      assert.eql(2, trivia.getQuestionCount());
      assert.eql(1, trivia.getScore("me"));
    },
    serializeUnserializeCompoundPerson : function () {
      Class("Person", {
        has : {
          name : null
        },
        methods : {
          serialize : function () {
            return {
              name : this.name
            };
          }
        }
      });
      var p;
      var trivia = Trivia.unserialize({
        questions : [{
          question : "foo",
          answers : ["bar"]
        }],
        score : [[{ name : "x" }, 1]]
      }, {
        personUnserializer : function (h) {
          p = new Person({
            name : h.name
          });
          return p;
        }
      });
      assert.eql(1, trivia.getScore(p));
    }
  };
})();
