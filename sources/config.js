const cors = require('cors') 
const bodyParser = require('body-parser') 
const morgan = require('morgan')

module.exports = (app) => {
  app.disable('x-powered-by');  

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
  app.use(morgan("dev"));
}