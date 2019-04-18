const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = 3000
app.use(express.urlencoded({extended : false}))
app.use(express.json())

const todoList = []

app.post('/publishedTodo', (req, res) => {
  io.emit('todoPublished', req.body.todo)

  res.status(200).json({
    message: 'Todo published.'
  })
})

io.on('connection', (socket) => {
  console.log('New connection created.')
  socket.on('introduction', (data) => {
    console.log(`Introduction event called with ${data}`)
    io.emit('newMember', data)
  })

  socket.on('newTodo', data => {
    todoList.push(data)

    io.emit('todoPublished', data)
  })
})



http.listen(port,() => {
  console.log(`listening on port: ${port}!`)
})