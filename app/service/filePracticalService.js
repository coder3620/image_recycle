// const db = require('../../config/pgsql');
const path = require('path');
const fs = require('fs');
const {Pool} = require('pg');
let db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });

const moment = require('moment-timezone');
const { query } = require('express');
console.log(db)
class FileService {
  upload(body, files) {
    return new Promise(async (resolve, reject) => {
      try {

        if(!files)
            throw "Select atleast 1 file";

        let date = moment().format('YYYY-MM-DD hh:mm:ss.SSS')


        const result = await db.query('INSERT INTO file (file_name, file_size, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *', [files.filename, files.size, date, date]);
        const data = result.rows[0];
        return resolve(data);
      } catch (error) {
        console.log(`\nupload service catch error ->> ${error}`);
        return reject(error);
      }
    });
  }

  listFile(query) {
    return new Promise(async (resolve, reject) => {
      try {
        if(query.is_deleted)
            query.is_deleted = 1
        else 
            query.is_deleted = 0;

        const result = await db.query('select id, file_name, file_size, created_at from file where is_deleted =  $1', [query.is_deleted]);
        const data = result.rows;

        const baseUrl = 'http://localhost:3000/uploads/active/';
        data.map(file => {
            file.file_name = baseUrl + file.file_name;
        });
        return resolve(data);
      } catch (error) {
        console.log(`\nupload service catch error ->> ${error}`);
        return reject(error);
      }
    });
  }

  deleteFile(params) {
    return new Promise(async (resolve, reject) => {
      try {
        const fileData = await db.query('SELECT * FROM file WHERE id = $1 and is_deleted = 0', [params.id]);
  
        if (fileData.rows.length === 0) {
          throw {
            statusCode: 404, 
            message: "File not found"
          }
        }
  
        const fileName = fileData.rows[0];
  
        const sourcePath = path.join(__dirname, `../../uploads/active/${fileName.file_name}`);
        const recyclePath = path.join(__dirname,`../../uploads/recycle/${fileName.file_name}`);
  
        console.log(sourcePath)
        await fs.promises.rename(sourcePath, recyclePath);
  
        const query = 'UPDATE file SET is_deleted = 1, updated_at = $1 WHERE id = $2 RETURNING *';
        const updated_at = new Date();
        await db.query(query, [updated_at, params.id]);
        return resolve()
  
      } catch (error) {
        console.log(`\ndelete file service catch error ->> ${error}`);
        return reject(error);
      }
    });
  }

  retrieveFile(params) {
    return new Promise(async (resolve, reject) => {
      try {
        const fileData = await db.query('SELECT * FROM file WHERE id = $1', [params.id]);

        if (fileData.rows.length === 0) {
            throw {
                statusCode: 404, 
                message: "File not found"
            }
          }

        const fileName = fileData.rows[0];

        if (fileName.is_deleted) {
            const activePath = path.join(__dirname, `../../uploads/active/${fileName.file_name}`);
            const recyclePath = path.join(__dirname,`../../uploads/recycle/${fileName.file_name}`);

            await fs.promises.rename(recyclePath, activePath);
            const query = 'UPDATE file SET is_deleted = 0, updated_at = $1 WHERE id = $2 RETURNING *';
            const updated_at = new Date();
            await db.query(query, [updated_at, params.id]);
        }

        return resolve()
  
      } catch (error) {
        console.log(`\nretrieveFile service catch error ->> ${error}`);
        return reject(error);
      }
    });
  }
}

module.exports = new FileService();