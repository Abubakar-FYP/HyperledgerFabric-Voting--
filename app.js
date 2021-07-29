const express = require('express')
const mongoose = require('mongoose')
const {MONGOURI} = require('./url/keys')

const sign = require('./routes/signup')
const vote = require('./routes/vote')
const ballot = require('./routes/ballot') //importing all routes

const requirelogin = require('./middleware/requirelogin')  //middleware

const app = express()

app.use(express.json()) //to parse outgoing json in the post req

app.use([sign,vote,ballot]) //registed all external routes


require('./models/admin')
require('./models/voter')
require('./models/candidate')
require('./models/hash')
require('./models/vote')
//models registered



///////MongoDB connection//////////////////////


mongoose.connect(MONGOURI,{ 
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useFindAndModify:false
})
//to remove deprecated warnings



mongoose.connection.on("connected",()=>{
 console.log("Successfully made a connection with MONGO")
}).


mongoose.connection.on("error",(err)=>{
    console.log("Failed to connect with MONGO",err)
    server.close()
})

mongoose.connection.on("exit",(err)=>{
    console.log("Failed to connect with MONGO",err)
    server.close()
})


app.get('/',(req,res)=>{
    res.send('working')
})

///////*MongoDB connection//////////////////////


app.listen(1230,()=>{
    console.log('connected')
})