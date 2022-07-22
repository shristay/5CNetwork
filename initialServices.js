const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",  
    user: "root",  
    password: "root",  
    database: "directoryDB"
    
  });

//   db.connect((err) => {
//     if (err) {  
//       throw err;  
//     }  
//     console.log("MySql Connected");  
//   });

router.get('/createdb', async(req, res) => {
    console.log("inside api");
    let sql = "CREATE DATABASE directoryDB";  
 
    db.query(sql, (err) => {  
      if (err) {  
        throw err;  
      }  
      res.send("Database created");  
    });
  
  })

router.get("/createDirectory", (req, res) => {

    let sql = 
      "CREATE TABLE directory (id int(10) unsigned NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, format varchar(255),  size varchar(255), createdTime datetime, updatedTime datetime,parent_id int(10) unsigned DEFAULT NULL,PRIMARY KEY (id), FOREIGN KEY (parent_id) REFERENCES directory (id) ON DELETE CASCADE ON UPDATE CASCADE);"
      db.query(sql, (err) => {  
        if (err) {  
            res.send("Error");  
          throw err;  
        
        } 
    }) 
        res.send("Table  created"); 
    })  

 router.get('/insertData', (req,res)=>{

    let sql = "INSERT INTO directory(name,format,size,createdTime,updatedTime,parent_id) VALUES ('root','folder',NULL,'2022-01-13 13:17:17', '2022-07-18 13:15:16', NULL), ('Folder1','folder','138Kb','2011-12-18 13:17:17', '2011-12-18 13:17:17', 1), ('Folder2','folder','138Kb','2011-12-18 13:17:17', '2011-12-18 13:17:17', 1), ('File1.png','png','138Kb','2011-12-18 13:17:17', '2011-12-18 13:17:17', 2), ('File2.png','png','138Kb','2011-12-18 13:17:17', '2011-12-18 13:17:17', 2), ('SubFolder1','folder','138Kb','2011-12-18 13:17:17', '2011-12-18 13:17:17', 3), ('SubFolder2','folder','138Kb','2011-12-18 13:17:17', '2011-12-18 13:17:17', 3), ('File4.pdf','pdf','138Kb','2011-12-18 13:17:17', '2011-12-18 13:17:17', 3),  ('File3.jpg','jpg','138Kb','2011-12-18 13:17:17', '2011-12-18 13:17:17', 7);"
    
    db.query(sql, (err) => {  
        if (err) {  
           // res.send("Error");  
          throw err;  
        
        } 
    }) 
    res.send("Initial Structure created");
 })   

 router.post('/insertNewData', (req,res)=>{
  let name = req.body.name;
  let format = req.body.format;
  let size = req.body.size;
  let createdTime = req.body.createdTime;
  let updatedTime = req.body.updatedTime;
  let parent_id = req.body.parent_id;

  let sql = `INSERT INTO directory(name,format,size,createdTime,updatedTime,parent_id) VALUES ("${name}", "${format}", "${size}", "${createdTime}", "${updatedTime}", "${parent_id}") ; `
  
  
    db.query(sql, (err) => {  
        if (err) {  
           // res.send("Error");  
          throw err;  
        
        } 
    }) 
    res.send("Additional Structure created");

 })


module.exports = router;