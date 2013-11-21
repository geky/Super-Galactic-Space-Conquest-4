
// Game object represents the current game
var game = {
    init: pass,
    step: pass,
    render: pass,
    click: pass,

    width: window.innerWidth * 0.95,
    height: window.innerHeight * 0.95,
}

// Game wrapper functions
function init() {
    debug(true)

    document.getElementById('game').onclick = click

    game.lasttime = new Date().getTime()
    game.delay = 1

    game.init()

    run()
}

function run() {
    var nowtime = new Date().getTime()
    var dt = (nowtime - game.lasttime)/(1000 * game.delay)
    var ctx = canvas('game')

    ctx.clearRect(0, 0, ctx.width, ctx.height)

    game.render(ctx)
    game.step(dt)

    game.lasttime = nowtime
    setTimeout(run, 28*game.delay)
}

function click(event) {
    game.click(vec(event.clientX, event.clientY))
}

// Nop function
function pass() {}

// Cache of images
var images = []

// Helper function for getting various resources
function canvas(w, h) {
    var can

    if (h != undefined) {
        can = document.createElement('canvas')
        can.width = w
        can.height = h
    } else {
        can = document.getElementById(w)
    }

    if (!can) alert("HTML5 not supported!")

    ctx = can.getContext('2d')

    ctx.width = can.width
    ctx.height = can.height

    ctx.render = function(path, w, h, pos, rot) {
        var img = images[path]

        if (!img) {
            img = load_image(path)
            images[path] = img
        }

        this.save()
        if (pos) this.translate(pos.x, pos.y)
        if (rot) this.rotate(rot)
        this.drawImage(img, -w/2, -h/2, w, h)
        this.restore()
    }

    return ctx
}

function load_image(path) {
    var img = document.createElement('img')
    img.src = path

    // replace all black pixels with transparent
    img.onload = function() {
        var ctx = canvas(img.width, img.height)
        ctx.drawImage(img, 0, 0)

        var raw = ctx.getImageData(0, 0, img.width, img.height)
        var data = raw.data

        for (var i = 0; i < data.length; i += 4) {
            if (!(data[i+0] & data[i+1] & data[i+2]))
                data[i+3] = 0
        }
        
        raw.data = data
        ctx.putImageData(raw, 0, 0)

        delete img.onload
        img.src = ctx.canvas.toDataURL("image/png")
    }

    return img
}

function load_file(path) {
    var client = new XMLHttpRequest()
    client.open('GET', path)
    client.send()
    
    while (!client.status) {}
    return eval(client.responseText)
}

// Debugging object
function debug(yes) {
    debug.debug = yes

    if (yes) {
        var ctx = canvas('game')
        console.log('Debugging Enabled')

        debug.log = console.log

        debug.push = function(pos) {
            ctx.save()
            if (pos) ctx.translate(pos.x, pos.y)
        }

        debug.vec = function(v, m, r, color) {
            ctx.beginPath()
            ctx.strokeStyle = color || 'white'
            ctx.moveTo(0, 0)
            ctx.lineTo(v.x/m*r, v.y/m*r)
            ctx.stroke()
            ctx.closePath()
        }

        debug.circle = function(p, r, color) {
            ctx.beginPath()
            ctx.strokeStyle = color || 'white'
            ctx.arc(p.x, p.y, r, 0, 2*Math.PI)
            ctx.stroke()
            ctx.closePath()
        }

        debug.pop = function() {
            ctx.restore()
        }
    } else {
        debug.log = pass

        debug.push = pass
        debug.vec = pass
        debug.circle = pass
        debug.pop = pass
    }
}
