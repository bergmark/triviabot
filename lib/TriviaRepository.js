var fs = require('fs');

Joose.Class("TriviaRepository", {
  has : {
    filePath : null,
    trivia : null
  },
  methods : {
    save : function (trivia) {
      fs.writeFileSync(this.filePath, JSON.stringify(trivia.serialize()));
    },
    load : function () {
      return Trivia.unserialize(JSON.parse(fs.readFileSync(this.filePath)));
    }
  }
});
