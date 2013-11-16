var app = require('http').createServer(handler)

app.listen(process.argv[2])
console.log("Started SGSC4 on port " + process.argv[2])

var io = require('socket.io').listen(app)
var fs = require('fs')


var homedir = __dirname + '/'


function handler (req, res) {
    console.log('req: ' + req.url)

    if (req.url == '/') req.url = '/index.html'

    fs.readFile(__dirname + req.url, function(err, data) {
        if (err) {
            res.writeHead(404)
            res.end('File Not Found')
        } else {
            res.writeHead(200)
            res.end(data)
        }
    })
}

/*io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' })

    socket.on('my other event', function (data) {
        console.log(data)
    });
});
*/
