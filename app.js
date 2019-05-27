const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended:false}));
// set the template engine ejs
// app.set('view engine', 'ejs')

// middleware
app.use(express.static(__dirname + '/public'))
// app.use(express.static('public'))

// routes
// app.get('/', (req, res) => {
//     res.render('test.html')
// })
let username;
// let users = []
app.post('/login', (req, res) => {
    if(req.body.userid !== '') {
        username = req.body.userid
    }
    else {
        username = "Anonymous"
    }
    // set the template engine ejs
    app.set('view engine', 'ejs')
    // routes
    res.render('add')

})

// listen on port 8000
server = app.listen(8000)

// socket.io instantiation
const io = require("socket.io")(server)


io.on('connection', (socket) => {
    console.log('New User Connected')

    socket.username = username
    // console.log(socket.username)
    // users.push(socket.username)
    // console.log(users)
    socket.on('username', (data) => {
        socket.broadcast.emit('username', {username : socket.username})
    })
    socket.on('new_user', () => {
        socket.broadcast.emit('new_user', {message : `${socket.username}` })
    })

    socket.on('new_message', (data) => {
        io.sockets.emit('new_message', {message : data.message, username : socket.username})
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {username : socket.username})
    })

    socket.on('disconnect', (socket) => {
        console.log("User disconnected!")
    })

})
