var Joose = require("Joose");

require('../vendor/CactusJuice/lib/Addon/Math');
var math = new CactusJuice.Addon.Math();

Joose.Class("State", {
  has : {
    questions : {
      init : function () { return []; }
    }
  },
  methods : {
    addQuestion : function (q) {
      this.questions.push(q);
    },
    getRandomQuestion : function () {
      return this.questions[math.rand(0, this.questions.length - 1)];
    }
  }
});
