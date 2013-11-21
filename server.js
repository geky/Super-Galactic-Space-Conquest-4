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
/*
races = [
 //   'Abbidon', 
    'Amonkrie', 
    'Cryslonite', 
  //  'CueCappa', 
    'Drushocka', 
    'Eee', 
  //  'Fazrah', 
    'Jraenar',
    'Krill',
    'Norak',
 //   'Phong',
//    'Piundon',
    'Praetorian',
    'Sallega',
  //  'Sergetti',
    'Terran',
   // 'Toltayan',
  //  'UkraTal',
    'Xiati',
    'XiChung'
]

var players = 0
var states = []

io.sockets.on('connection', function (socket) {
    var me = players;
    players++;

    socket.emit('new', {
        race: races[me % races.length],
        money: 10000,
        me: me
    })

    socket.on('submit', function (data) {
        states.push(data)
        console.log("Submit " + states.length + " of " + players)

        if (states.length == players) {
            console.log("Taking Turn")
            console.log(states)
            io.sockets.emit('turn', states)
            states = []
        }
    });

    socket.on('disc', function() {
        players--;
    })
});
*/
