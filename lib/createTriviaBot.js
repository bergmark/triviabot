var path = require('path');
var EventSubscription = CactusJuice.Util.EventSubscription;

function createTriviaBot(options) {
  var filePath = "./trivia.txt";

  var trivia = null;

  var triviaRepository = new TriviaRepository({
    filePath : filePath
  });
  var triviaChannel = null;

  var questionTimeout = null;
  var questionTime = 5000;

  Class("TriviaBot", {
    isa : IrcWrapper,
    does : EventSubscription,
    methods : {
      onTriviaLoaded : Function.empty
    }
  });

  var iw = new TriviaBot({
    IRC : options.IRC,
    server : options.server,
    nicks : options.nicks,
    joinChannels : options.joinChannels,
    admins : ["adnam!*@*"],
    bindings : [adminCommands, {
      privmsg : [{
        messageString : "!trivia",
        callback : function (h) {
          if (trivia.isStarted()) {
            return;
          }
          triviaChannel = h.location;
          trivia.start();
        }
      }, {
        callback : function (h) {
          if (!trivia.isStarted()) {
            return;
          }
          trivia.answer(h.person, h.message);
        }
      }, {
        messageString : "!quit",
        callback : function (h) {
          if (!iw.isAdmin(h.person)) {
            return;
          }
          iw.getIrc().quit();
        }
      }, {
        messageRegExp : /!help !?add/,
        callback : function (h) {
          h.reply("Add a question, !add <question>?<answer>*<answer 2>*...");
        }
      }, {
        messageRegExp : /^!add (.+?)\?(.+)$/,
        callback : function (h) {
          var question = h.regExp[1];
          var answers = h.regExp[2].split(/\*/g);
          trivia.createQuestion(question, answers);
          triviaRepository.save(trivia);
          h.reply("Added question.");
        }
      }]
    }]
  });
  var irc = iw.getIrc();

  path.exists(filePath, function (exists) {
    trivia = exists ? triviaRepository.load() : new Trivia();

    trivia.subscribe("Started", function () {
      irc.privmsg(triviaChannel, "Trivia started!");
    });
    trivia.subscribe("Stopped", function () {
      irc.privmsg(triviaChannel, "Trivia was stopped.");
    });
    trivia.subscribe("NewQuestion", function () {
      irc.privmsg(triviaChannel, trivia.getQuestionNumber() + ". " + trivia.getCurrentQuestionString());
      questionTimeout = setTimeout(trivia.timesUp.bind(trivia), questionTime);
    });
    trivia.subscribe("Answered", function (s, person) {
      clearTimeout(questionTimeout);
      var score = s.getScore(person);
      irc.privmsg(triviaChannel, person.getNick() + " got the right answer! Score: " + score);
    });
    trivia.subscribe("TimesUp", function () {
      iw.privmsg(triviaChannel, "Time's up!");
    });
    iw.onTriviaLoaded();
  });

  iw.getTrivia = function () {
    return trivia;
  };

  return iw;
}

module.exports = {
  createTriviaBot : createTriviaBot
};
