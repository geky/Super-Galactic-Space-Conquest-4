var app = require('http').createServer(handler)
var io = require('socket.io').listen(app)
var fs = require('fs')

app.listen(8083)

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
