var IRC = require('./vendor/IRC-js/lib/irc');
var IrcWrapper = require('./vendor/IrcWrapper/lib/IrcWrapper');
var triviabot = require('./triviabot');
var createTriviaBot = triviabot.createTriviaBot;

var iw = createTriviaBot({
  IRC : IRC,
  server : "irc.vassius.se",
  nick : "triviabot",
  joinChannels : ["#c-test"]

});

iw.getTrivia().addQuestion(new Question({
  question : "What is 1+1?",
  answers : ["2", "two"]
}));
iw.getTrivia().addQuestion(new Question({
    question : "What is 1-1?",
    answers : ["0", "zero"]
}));
