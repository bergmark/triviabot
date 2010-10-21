var triviabot = require('./triviabot');
var IRC = triviabot.IRC;
var createTriviaBot = triviabot.createTriviaBot;

var iw = createTriviaBot({
  IRC : IRC,
  server : "irc.vassius.se",
  nicks : ["triviabot"],
  joinChannels : ["#c-test"]
});

iw.subscribe("TriviaLoaded", function () {
  iw.getTrivia().createQuestion("What is 1+1?", ["2", "two"]);
  iw.getTrivia().createQuestion("What is 1-1?", ["0", "zero"]);
});
