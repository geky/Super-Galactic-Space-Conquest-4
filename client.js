
// This object represents a page usage
var page = function() {
    return {
        init: pass,
        resize:pass,
        step: pass,
        render: pass,
        click: pass,
        deinit: pass,
    }
}

var current = page()

// Game wrapper functions
function init() {
    debug(true)

    current = window[location.hash.substr(1) || 'game']

    current.ctx = canvas('game')
    current.ctx.canvas.onclick = click
    window.onresize = resize

    current.lasttime = new Date().getTime()
    current.delay = 1

    current.init()

    resize()
    run()
}

function resize() {
    var ctx = current.ctx
    ctx.width = ctx.canvas.width = window.innerWidth
    ctx.height = ctx.canvas.height = window.innerHeight
}

function run() {
    var nowtime = new Date().getTime()
    var dt = (nowtime - current.lasttime)/1000
    var ctx = current.ctx

    ctx.clearRect(0, 0, ctx.width, ctx.height)

    current.render(ctx)
    current.step(dt)

    debug.fps(dt, vec(10,10))
    current.lasttime = nowtime
    current.pid = requestFrame(run)
}

function click(event) {
    current.click(vec(event.clientX, event.clientY), event)
}

function deinit() {
    current.deinit()
    cancelFrame(current.pid)
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
            img = loadImage('data/' + path)
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

function loadImage(path) {
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

function loadFile(path) {
    var client = new XMLHttpRequest()
    client.open('GET', path)
    client.send()
    
    while (!client.status) {}
    return eval(client.responseText)
}

function gotocanvas(name) {
    deinit()
    location.replace('#' + name)
    init()
}


var requestFrame = (
    window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(callback) { return setTimeout(callback, 28) } 
)

var cancelFrame = (
    window.cancelAnimationFrame       ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame    ||
    window.oCancelAnimationFrame      ||
    window.msCancelAnimationFrame     ||
    function(pid) { return clearTimeout(pid) }
)


// Debugging object
function debug(yes) {
    debug.debug = yes

    if (yes) {
        var ctx = canvas('game')
        console.log('Debugging Enabled')

        debug.log = function(args) {
            console.log(args)
        }

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

        debug.print = function(str, p, color) {
            ctx.textBaseline = 'top'
            ctx.fillStyle = color || 'white'
            ctx.font = '12px Lucida Console'
            ctx.fillText(str, p.x, p.y)
        }            

        debug.pop = function() {
            ctx.restore()
        }

        var avgfps = 0
        debug.fps = function(dt, p, color) {
            var fps = dt > 0 ? (1.0/dt) : 0
            avgfps = (0.99*avgfps) + (0.01*fps)

            this.print('fps:' + ~~avgfps + ':' + ~~fps, p, color)
        }

    } else {
        debug.log = pass

        debug.push = pass
        debug.vec = pass
        debug.circle = pass
        debug.print = pass
        debug.pop = pass

        debug.fps = pass
    }
}
