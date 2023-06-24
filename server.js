const express = require('express')
const chats = require('./backend/data/data')
const dotenv = require('dotenv')
const connectDB = require('./backend/config/db')
const { notFound , errorHandler } = require('./backend/middlewares/errorMiddleware')
const userRoutes = require('./backend/routes/userRoutes')
const chatRoutes = require('./backend/routes/chatRoutes') 
const messageRoutes = require('./backend/routes/messageRoutes')
const app = express()
const cors = require('cors')
const path = require('path')

app.use(cors())

dotenv.config()
connectDB()
const Port = process.env.PORT 



app.use(express.json())


app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)


//   Deployment
const __dirname1 = path.resolve()

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname1,"/frontend/build")))

  app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"))
  })
}
else{
  app.get("/", (req,res)=>{
    res.send("API Running Successfully")
  })
}

app.use(notFound)
app.use(errorHandler)

// app.get('/api/chat', (req,res)=>{
//     res.send(chats)
//     console.log(chats);
// })

const server = app.listen(Port, console.log(`Server Started on port ${Port}`))

var io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});



  io.on("connection", (socket)=>{
    console.log('Connected to socket');
    socket.on('setup', (userData)=>{
      socket.join(userData._id)
      console.log(userData._id);
      socket.emit("connected")
    })

    socket.on('join-chat', (room)=>{
      socket.join(room)
      console.log('User Joined the room' + room);
    })

    socket.on('typing', (room)=> socket.in(room).emit("typing"))
    socket.on('stop-typing', (room)=> socket.in(room).emit("stop-typing"))

    socket.on('new-message', (newMessageRecieved)=>{
      var chat = newMessageRecieved.chat

      if(!chat.users) return console.log('chat.users not defined');

      chat.users.forEach(user=>{
        if(user._id === newMessageRecieved.sender._id) return

        socket.in(user._id).emit("message recieved", newMessageRecieved)
      })
    })

    socket.off("setup", ()=>{
      console.log("User Disconnected")
      socket.leave(userData._id)
    })
  })
app.get('/api/chat/:id', (req,res)=>{
    // console.log(req.params.id)

    const singleChat = chats.find((c)=> c._id === req.params.id)
    res.send(singleChat)
})
