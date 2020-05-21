const bodyParser = require('body-parser');

let parseBody = app => {
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
}

module.exports = parseBody;
