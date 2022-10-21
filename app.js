const express = require('express')
const env = require('dotenv')
const mysql =  require('mysql')

const app = express()

// .env config
env.config()

const port = process.env.PORT || 3000

// Database Connection
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : process.env.DATABASE
  });

db.connect((err) => {
    if(err) throw err;
    console.log('Connected to DB successfully!');
})
// **END**  

app.listen(port, () => console.log(`App listening on port ${port}!`))

//Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))
// **END**

// Read
app.get('/read', async (req, res) => {

    const response =  await new Promise((resolve, reject) => {
        const sql = "SELECT * FROM names";
        db.query(sql, (err, result) => {
            if(err) reject(new Error(err.message));
            resolve(result)
        })
    })

    res.json(response)
  
})

// Post
app.post('/post', async(req, res) => {
    const date = new Date(); //the current time and date of insertion
   
    const response = await new Promise( (resolve, reject) => {
        const sql = "INSERT INTO names SET ?";
        db.query(sql, {name : req.body.name, date_added: date}, (err, result) => {
            if(err) reject(new Error(err.message))
            resolve(result)
        })
    })

    res.json(response)
   
}) 

// Read By ID
app.get('/read/:id', async(req, res) => {
   
    const response = await new Promise( (resolve, reject) => {
        const sql = "SELECT * FROM names WHERE id = ?";
        db.query(sql, req.params.id, (err, result) => {
            if(err) reject(new Error(err.message));
            resolve(result)
        })
    })
    res.json(response)
   
})


// Update
app.patch('/update/:id', async(req, res) => {
    const response = await new Promise((resolve, reject) => {
        const sql = "UPDATE names SET name = ? WHERE id = ?";
        db.query(sql, [req.body.name, req.params.id], (err, result) => {
            if(err) reject(err)
            resolve(result)
        })
    })
    res.json(response);
})


// Delete
app.delete('/delete/:id', async(req, res) => {

    const response = await new Promise((resolve, reject) => {
        const sql = "DELETE FROM names WHERE id = ?";
        db.query(sql, req.params.id, (err, result) => {
            if(err) reject(new Error(err.message));
            resolve(result)
        })
    })
    
    res.json(response)
    
})
