
current.init = game_init



function game_init() {
    ui_init()

//    images.push(mothership.image)

/*    images.push({
        image: effect_image("data/races/Terran/Terran_BigExplosion.bmp", 7),
        pos: new Vec(300, 100),
        width: 50,
        height: 50,
    })*/

/*    images.push({
        image: gimmie("data/misc/Lazers.bmp",11),
        pos: new Vec(600, 100),
        width: 50,
        height: 50,
    })

    images.push({
        image: pewpew("data/misc/Lazers.bmp",11,5),
        pos: new Vec(700, 100),
        width: 50,
        height: 50,
    })*/
}

var sim_time = 0

var S = 0

function sim(dt) {
    for (var i = 0; i < state.player.ships.length; i++) {
        state.player.ships[i].step(dt)
    }

    for (var i = 0; i < state.others.length; i++) {
        for (var j = 0; j < state.others[i].ships.length; j++) {
            state.others[i].ships[j].step(dt)
        }
    }

    sim_time += dt
    if (sim_time >= state.player.time) {
        current.step = function(){}

        if (S == 1)
            fromjson(currentstate)
    }
}

function simulate() {
    S = 1
    no_select()
    currentstate = tojson()
    sim_time = 0
    current.step = sim
}

function replay() {
    S = 2
    no_select()
    currentstate = tojson()
    fromjson(prevstate)
    sim_time = 0
    current.step = sim
}

function play() {
    S = 3
    no_select()
    sim_time = 0
    current.step = sim
}

function closest(pos) {
    var min = Infinity
    var target

    for (var i = 0; i < state.others.length; i++) {
        for (var j = 0; j < state.others[i].ships.length; j++) {
            var d = pos.distsq(state.others[i].ships[j].pos)

            if (d < min) {
                min = d
                target = state.others[i].ships[j]
                target.race = state.others[i].race
                console.log(target.race)
                target.ind = j
            }
        }
    }

    return target
}

/*function missile(race, pos, target) {
    console.log('pew pew pew ' + pos.x + " " + pos.y)
    var m = new Ship('!' + race, 1, 300, 40, pos.x, pos.y)
    m.task = ['target', target.r, target.ind]
    rget(target.r).ships.push(m)
}

rget = function(race) {
    if (race == state.player.race)
        return state.player

    for (var i = 0 ; i < state.others.length; i ++) {
        if (state.others[i].race == race)
            return state.others[i]
    }

    return state.player
}*/
