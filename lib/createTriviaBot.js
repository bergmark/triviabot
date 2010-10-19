function createTriviaBot(options) {
  var trivia = new Trivia();
  var triviaChannel = null;

  var iw = new IrcWrapper({
    IRC : options.IRC,
    server : options.server,
    nick : options.nick,
    joinChannels : options.joinChannels,
    admins : ["adnam!*@*"],
    bindings : {
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
      }]
    }
  });
  var irc = iw.getIrc();

  trivia.subscribe("Started", function () {
    irc.privmsg(triviaChannel, "Trivia started!");
  });
  trivia.subscribe("Stopped", function () {
    irc.privmsg(triviaChannel, "Trivia was stopped.");
  });
  trivia.subscribe("NewQuestion", function () {
    irc.privmsg(triviaChannel, trivia.getQuestionNumber() + ". " + trivia.getCurrentQuestionString());
  });
  trivia.subscribe("Answered", function (s, person) {
    var score = s.getScore(person);
    irc.privmsg(triviaChannel, person.getNick() + " got the right answer! Score: " + score);
  });

  iw.getTrivia = function () {
    return trivia;
  };

  return iw;
}

module.exports = {
  createTriviaBot : createTriviaBot
};
