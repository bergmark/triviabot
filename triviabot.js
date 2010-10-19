require('./vendor/CactusJuice/CactusJuice');
require('./lib/Question.js');
require('./lib/Trivia.js');
var ctb = require('./lib/createTriviaBot');
module.exports = {
    createTriviaBot : ctb.createTriviaBot
};
