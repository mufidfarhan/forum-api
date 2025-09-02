require('dotenv').config();
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');
const config = require('./Commons/config');

(async () => {
  const app = await createServer(container);
  const port = config.app.port || 5000;
  const host = config.app.host || 'localhost';
  
  app.listen(port, host, () => {
    console.log(`server start at http://${host}:${port}`);
  });
})();
