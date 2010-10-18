var Joose = require("Joose");

Joose.Class("State", {
  has : {
    questions : {
      init : function () { return []; }
    }
  },
  methods : {
    addQuestion : function (q) {
      this.questions.push(q);
    }
  }
});
