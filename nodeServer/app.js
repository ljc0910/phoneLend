const express = require('express');
const mongoose = require('mongoose')
const uerRouters = require('./api/user')
const addOrchange = require('./api/addOrchange')
const listQuery = require('./api/listQuery')
const app = express();
const bodyParser = require('body-parser')

let dbUrl = 'mongodb://localhost:27017/vuelogin';
mongoose.connect(dbUrl);

app.get('/',(req,res)=>{
	res.send("server run at 4000")
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 错误处理
app.use((err, req, res, next) => { 
  res.status(442).send({ error: err.message })
})


app.use('/api',uerRouters)
app.use('/api',addOrchange)
app.use('/api',listQuery)
const server = app.listen(4000,()=>{
	
})
