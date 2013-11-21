

var state = {
    player: {
        race: 'Terran',
        money: 0,
        me: -1,
        ships: [],
        time: 5
    },

    others: []
}

var prevstate
var currentstate

function shipstojson(ships) {
    var newships = []

    for (var i = 0; i < ships.length; i++) {
        newships.push(ships[i].tojson())
    }

    return newships
}

function cleanships(ships) {
    for (var i = 0; i < ships.length; i++) {
        ships[i].rm()
    }
}

function cleanstate() {
    cleanships(state.player.ships)

    for (var i = 0; i < state.others.length; i++) {
        cleanships(state.others[i].ships)
    }

    state = {}
}


function tojson() {
    var new_state = {
        player:{
            money: state.player.money,
            time: state.player.time,
            me: state.player.me,
            race: state.player.race,
            ships: shipstojson(state.player.ships),
        },
        others: []
    }

    for(var i = 0; i < state.others.length; i++){
        new_state.others[i] = {
            race: state.others[i].race,
            ships: shipstojson(state.others[i].ships),
        }
    }
    return new_state
}

function shipsfromjson(race, json) {
    var newships = []

    for (var i = 0; i < json.length; i++) {
        newships.push(Ship.fromjson(race, json[i]))
    }

    return newships
}
    

function fromjson(json) {
    cleanstate();

    state = {
        player:{
            money: json.player.money,
            time: json.player.time,
            me: json.player.me,
            race: json.player.race,
            ships: shipsfromjson(json.player.race, json.player.ships),
        },
        others: []
    }

    for(var i = 0; i < json.others.length; i++){
        state.others[i] = {
            race: json.others[i].race,
            ships: shipsfromjson(json.others[i].race, json.others[i].ships),
        }
    }
}

//
//function copyships(ships) {
//    var newships = []
//
//    for (var i = 0; i < ships.length; i++) {
//        newships.push(ships[i].copy())
//    }
//
//    return newships
//}
//
//function copystate(state) {
//    var new_state = {
//        player:{
//            race: state.player.race,
//            money: state.player.money,
//            ships: copyships(state.player.ships),
//            time: state.player.time,
//            me: state.player.me
//        },
//        others: []
//    }
//    for(var i = 0; i < state.player.others.length; i++){
//        new_state.others[i] = {
//            race: state.others[i].race,
//            money: state.others[i].money,
//            ships: copyships(state.others[i].ships),
//            time: state.others[i].time,
//            me: state.others[i].me
//        }
//    }
//    return new_state
//}
//
//function fromjson(json) {
//}
//
//function tojson(state) {
//    var new_state = {
//        player:{
//            race: state.player.race,
//            money: state.player.money,
//            ships: copyships(state.player.ships),
//            time: state.player.time,
//            me: state.player.me
//        },
//        others: []
//    }
//    for(var i = 0; i < state.player.others.length; i++){
//        new_state.others[i] = {
//            race: state.others[i].race,
//            money: state.others[i].money,
//            ships: copyships(state.others[i].ships),
//            time: state.others[i].time,
//            me: state.others[i].me
//        }
//    }
//    return new_state
//    


var socket = io.connect(window.location.href);

window.onbeforeunload = function() {
    socket.send({disc:0})
    console.log("disconnecting")
}

socket.on('new', function (data) {
    state.player.race = data['race']
    state.player.money = data['money']
    state.player.me = data['me']

    mothership = new Ship(state.player.race, 10, 300, 40, (40+600*state.player.me) % 1000, 50)
    othership = new Ship(state.player.race, 10, 300, 40, (40+600*state.player.me) % 1000, 250)
    //mothership.select()
    /*images.push(mothership.image)
    elements.push(mothership.button)
    images.push(othership.image)
    elements.push(othership.button)*/

    state.player.ships = [ mothership, othership ]
});

var Q = 0

function submit() {
    socket.emit('submit', tojson(state).player)
}

socket.on('turn', function(data) {
    res = {}

    res.player = data.splice(state.player.me, 1)[0]
    res.others = data
    prevstate = res
    fromjson(res)

    play()
})
