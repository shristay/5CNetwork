const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mysql = require('mysql2');
const initialServices= require('./initialServices')
const assessService = require('./assessmentServices');



app.use(bodyparser.json());
app.use(initialServices)
app.use(assessService);

const db = mysql.createConnection({
    host: "localhost",  
    user: "root",  
    password: "root",  
    
  });

  db.connect((err) => {
    if (err) {  
      throw err;  
    }  
    console.log("MySql Connected");  
  });



 
app.post('/directory', async(req,res)=>{

})




app.listen(3000,()=>{
    console.log("Server started on port 3000");
})
