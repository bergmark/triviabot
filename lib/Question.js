var Joose = require('Joose');

require('../vendor/CactusJuice/lib/Data/Collection');
var collection = new CactusJuice.Data.Collection();

Joose.Class("Question", {
  has : {
    question : {
      is : "ro"
    },
    answers : {
      init : function () { return []; }
    }
  },
  methods : {
    isCorrectAnswer : function (answer) {
      return collection.hasValue(this.answers, answer);
    }
  }
});
