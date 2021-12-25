const bodyParser = require('body-parser');
const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
require('dotenv').config()
//hola

const connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
})
connection.connect()
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('Database Server is running!');
  });
   
const app = express()
const port  = 3000

app.use(cors())

  
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//ruta para traernos a todos los usuarios
app.get('/users',(req,res)=>{
    const sql = 'SELECT * FROM users'
    connection.query(sql,(err,result)=>{
        if(err) throw err
        if(result.length>0) res.json(result)
        else res.send('there is no registers in the table')
    })
})
//ruta para traernos a todos los posts
app.get('/posts',(req,res)=>{
    const sql = `SELECT posts.id as post_id,users.id as user_id,UserName,qualification,createdAt,score,workflow,coverImage FROM posts
    JOIN users 
    ON posts.user_id = users.id`
    connection.query(sql,(err,result)=>{
        if(err) throw err
        if(result.length>0) res.json(result)
        else res.send('there is no registers in the table')
    })
})
//ruta para crear un nuevo post
app.post('/posts',(req,res)=>{
    const sql = 'INSERT INTO posts SET ?'
    const body = req.body
    connection.query(sql,body,err=>{
        if(err) throw err
        console.log('post created succesfully')
        res.send('post created succesfully')
    })
    
})
//ruta para actualizar un post
app.patch('/posts/:id',(req,res)=>{
    const {id} = req.params
    const { user_id, score, workflow, createdAt, coverImage} = req.body
    console.log(req.body)

    const sql = `UPDATE posts SET user_id = '${String(user_id)}', score = '${String(score)}', workflow= '${workflow}', createdAt='${createdAt}', coverImage='${coverImage}' WHERE id=${id} `
    connection.query(sql,(err,result)=>{
        if(err) throw err
        res.json('post updated succesfully')
    })
})
//ruta para eliminar un post
app.delete('/posts/:id',(req,res)=>{
    const {id} = req.params
    const sql_users_posts = `DELETE FROM users_posts WHERE post_id=${id}`
    const sql_posts = `DELETE FROM posts WHERE id = ${id}`
    connection.query(sql_users_posts,(err,result)=>{
        if(err) throw err
        
    })
    connection.query(sql_posts,(err,result)=>{
        if(err) throw err
        res.json('post deleted succesfully')
    })
})
//ruta para traernos los usuarios asignados a un post especifico
app.get('/posts/:id/assignees',(req,res)=>{
    const {id} = req.params
    const sql = `SELECT UserName FROM users_posts
                JOIN users
                ON users_posts.user_id = users.id
                WHERE users_posts.post_id = ${id}
                `
    connection.query(sql,(err,result)=>{
                    if(err) throw err
                    console.log(result)
                    res.json(result)
                })
})
//ruta para agregar un usuario a un post especifico
app.post('/assignees/:user_id/:post_id',(req,res)=>{
    const {user_id,post_id} = req.params
    const sql = `INSERT INTO users_posts (user_id,post_id) VALUES (${user_id},${post_id}) `
    connection.query(sql,(err,result)=>{
        if(err) throw err
        console.log(result)
        res.json(result)
    })
})
//ruta para eliminar un usuario en un post especifio 
app.delete('/assignees/:user_id/:post_id',(req,res)=>{
    const {user_id,post_id} = req.params
    const sql = `DELETE FROM users_posts WHERE post_id=${post_id} AND user_id=${user_id}`
    connection.query(sql,(err,result)=>{
        if(err) throw err
        console.log(result)
        res.json(result)
    })

})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
  