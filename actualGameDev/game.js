
current.init = game_init
current.step = game_step
current.click = game_click

var mothership = new Ship('Terran', 10, 300, 40, 40, 50)

function game_click(pos) {
    mothership.add_endpoint(pos)
}

function game_init() {
    ui_init(mothership)
    mothership.select()

    images.push(mothership.image)

    images.push({
        image: effect_image("data/races/Terran/Terran_BigExplosion.bmp", 7),
        pos: new Vec(300, 100),
        width: 50,
        height: 50,
    })

    images.push({
        image: gimmie("data/misc/Torps.bmp",2),
        pos: new Vec(600, 100),
        width: 50,
        height: 50,
    })
}


function game_step(dt) {
    mothership.step(dt, canvas('field'))
}
