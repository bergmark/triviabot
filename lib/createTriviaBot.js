function createTriviaBot(IRC) {
  return new IrcWrapper({
    IRC : IRC,
    server : "irc.vassius.se",
    nick : "triviabot",
    joinChannels : ["#c-test"],
    bindings : {
      join : [{
        callback : function (h) {
        }
      }],
      privmsg : [{
        messageString : "!trivia",
        callback : function (h) {
          if (s.isRunning()) {
            console.log("isRunning");
            return;
          }
          h.reply("Starting trivia!");
          s.nextQuestion();
          h.reply(s.getI() + ". " + s.getCurrentQuestion().getQuestion());
        }
      }, {
        callback : function (h) {
          if (!s.isRunning()) {
            return;
          }
          if (s.getCurrentQuestion().isCorrectAnswer(h.message)) {
            h.reply(h.person.getNick() + " got the right answer!");
            s.nextQuestion();
            h.reply(s.getI() + ". " + s.getCurrentQuestion().getQuestion());
          }
        }
      }]
    }
  });
}
