const http = require('http')  // use require to import the Node.js http package
const express = require('express')  // require Express framework
const app = express()  // create an Express web app
const server = http.createServer(app)  // pass in the Express app to our http server
const io = require('socket.io')(server) // pass in our server to get a Socket.io server
const path = require('path')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const errorHandler = require('errorhandler')

//const hostname = '0.0.0.0'    // allows access from remote computers
//const port = 3003;

// By default, Express does not serve static files. 
// Configure middleware with app.use
// use '/public to access files in the 'public' folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// on a GET request to default page, serve up html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }))
app.use(expressLayouts)
app.use(errorHandler()) // load error handler
const port = 3003
const host = '0.0.0.0'
const env = app.get('env')

const routes = require('./routes/index.js')
app.use('/', routes)  // load routing to handle all requests

// on a connection event, act as follows (socket interacts with client)
io.on('connection', (socket) => {
  socket.on('chatMessage', (from, msg) => {  // on getting a chatMessage event
    io.emit('chatMessage', from, msg)  // emit it to all connected clients
  })
  socket.on('notifyUser', (user) => {  // on getting a notifyUser event
    io.emit('notifyUser', user)  // emit to all
  })
})


server.listen(port, host, () => {
  // Tell the user where to find the app (use backtics with variables)
  console.log(`Server running at http://${host}:${port}/`)
})

/*app.listen(app.get('port'), () => {
  console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'))
  console.log(' Press CTRL-C to stop\n')
  })
  */