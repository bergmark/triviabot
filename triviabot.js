require('CactusJuice/CactusJuice');
var IRC = require('irc-js');
var IW = require('IrcWrapper/IrcWrapper');
require('./lib/Question');
require('./lib/Trivia');
require('./lib/TriviaRepository');
var ctb = require('./lib/createTriviaBot');
module.exports = {
  IRC : IRC,
  createTriviaBot : ctb.createTriviaBot,
  adminCommands : IW.adminCommands
};
global.adminCommands = IW.adminCommands;
