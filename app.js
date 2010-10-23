var triviabot = require('./triviabot');
var IRC = triviabot.IRC;
var createTriviaBot = triviabot.createTriviaBot;

var iw = createTriviaBot({
  IRC : IRC,
  server : "irc.vassius.se",
  nicks : ["triviabot"],
  joinChannels : ["#c-test"],
  filePath : "./trivia.txt",
  questionTime : 5,
  admins : ["adnam!*@*"]
});
