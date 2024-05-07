const {Pool} = require('pg');

let db;

class DB {
  getDBConnect() {
    return new Promise(async (resolve, reject) => {
      try {
        db = new Pool({
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT
        });

        console.log(process.env.DB_NAME)

        db.connect((error) => {
          if (error) {
            console.log(`\nPgsql Error ->> ${error}`);
            throw error;
          }
        });
        return resolve(db);
      } catch (error) {
        console.log(`\ngetDBConnect catch error ->> ${error}`);
        return reject(error);
      }
    });
  }
}

module.exports = new DB();