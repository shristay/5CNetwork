
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {parse, stringify} = require('flatted');


const db = mysql.createConnection({
    host: "localhost",  
    user: "root",  
    password: "root",  
    database: "directoryDB"
    
  });

//This API adds new entry into the DB
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


//Get a list of all files reverse sorted by date
router.get('/getFiles', async(req,res)=>{
  
  
    let sql = `SELECT name FROM directory WHERE format <> "folder" ORDER BY updatedTime DESC `
    
   let result=   db.query(sql, (err,result) => {  
          if (err) {  
             res.send("Error:",err);  
            
          
          } 
          else{
                res.send(result)
          }
          
      }) 
     
   })

 
// Find the total size of a folder (like total size of files contained in Folder2) 
router.get('/getFolderSize', async(req,res)=>{
  let folderName = req.query.folderName;
  
    let sql = `select sum(size) from directory where (select id from directory where name = "${folderName}") = parent_id;`
    
   let result=   db.query(sql, (err,result) => {  
          if (err) {  
             res.send("Error:",err);  
            
          
          } 
          else{
                res.send(result)
          }
          
      }) 
     
   })

//Rename SubFolder2 to NestedFolder2 
router.get('/renameFolders', async(req,res)=>{
      let folderName = req.query.folderName;
      let newName = req.query.newName;
      
        let sql = `update directory set name= "${newName}" where name="${folderName}";`
        
       let result=   db.query(sql, (err,result) => {  
              if (err) {  
                 res.send("Error:",err);  
                
              
              } 
              else{
                    res.send(result)
              }
              
          }) 
         
       })

//Write the response of below mentioned api in a json file and store file details in database 
//○ GET - https://api.github.com/users/mralexgray/repos 

router.post('/storingData', async(req,res)=>{
   try{
      const data = await axios.get('https://api.github.com/users/mralexgray/repos').then(r=>{ return r});
      const fileName = req.body.fileName;
      fs.writeFile(`${fileName}.json`, stringify(data), function (err) {
         if (err) throw err;
         console.log('File is created successfully.');
       });

       let name = `${fileName}.json`;

       let format = path.extname(`${fileName}.json`);
       let size = (fs.statSync(`${fileName}.json`).size)/1024 + "kb";
       let createdTime = (fs.statSync(`${fileName}.json`).birthtime).toISOString().slice(0, 19).replace('T', ' ');
       let updatedTime = (fs.statSync(`${fileName}.json`).mtime).toISOString().slice(0, 19).replace('T', ' ');
       let parent_id = 1;

       console.log(createdTime,updatedTime)
     
       let sql = `INSERT INTO directory(name,format,size,createdTime,updatedTime,parent_id) VALUES ("${name}", "${format}", "${size}", "${createdTime}", "${updatedTime}", "${parent_id}") ; `
       
       db.query(sql, (err) => {  
         if (err) {  
            // res.send("Error");  
           throw err;  
         
         } 
     }) 

      res.send("Data written")
   

   }
   catch(e){
      console.log("exception occured", e)
   }

   
      
    })



       



   
module.exports = router;