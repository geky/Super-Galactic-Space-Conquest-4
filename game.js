
var testrace = {
    designs: [
        {
            image: 'data/races/Terran/Terran_Mini_FighterSmall.bmp',
            rad: vec.len(vec(18, 18)),

            mass: 100,
            force: 100000,
            speed: 1000,
        },

        {
            image: 'data/races/Terran/Terran_Mini_Carrier.bmp',
            rad: vec.len(vec(18, 18)),
            
            mass: 100,
            force: 1000,
            speed: 100,
        },
    ],

    ships: [
        ship(0, vec(40, 40)),
        ship(0, vec(40, 80)),
        ship(1, vec(40, 120)),
        ship(0, vec(140, 40)),
        ship(0, vec(140, 80)),
        ship(1, vec(140, 120)),
        ship(0, vec(240, 40)),
        ship(0, vec(240, 80)),
        ship(1, vec(240, 120)),
        ship(0, vec(340, 40)),
        ship(0, vec(340, 80)),
        ship(1, vec(340, 120)),
    ]
}

var selected = testrace.ships[0]

game.step = function(dt) {
    for (var i = 0 ; i < testrace.ships.length; i++) {
        var sh = testrace.ships[i]
        var des = testrace.designs[sh.des]
        ship.step(sh, des, dt)
    }
}

game.render = function(ctx) {
    for (var i = 0 ; i < testrace.ships.length; i++) {
        var sh = testrace.ships[i]
        var des = testrace.designs[sh.des]
        ship.render(sh, des, ctx)
    }
}

game.click = function(pos) {
    var clicked = false

    for (var i = 0 ; i < testrace.ships.length; i++) {
        var sh = testrace.ships[i]
        var des = testrace.designs[sh.des]

        if (vec.distsq(pos, sh.pos) < des.rad*des.rad) {
            selected = sh
            clicked = true
        }
    }

    if (!clicked) {
        selected.task = 2
        selected.target = pos
        console.log(selected.target)
    }
}
