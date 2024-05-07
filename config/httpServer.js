const http = require('http');
const app = require('../index');

module.exports = () => {
  return new Promise((resolve, reject) => {
    try {
        server = http.createServer(app);
        return resolve();
    } catch (error) {
      console.log(`\nhttpServer catch error - >>`, error)
      return reject(error)
    }
  });
}