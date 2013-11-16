var lasttime
var delay

current = {
    init: function() {},
    step: function() {},
    click: function() {}
}

elements = []
images = []
lines = []


function init(d) {
    lasttime = new Date().getTime()
    delay = d ? d : 1

    current.init()

    document.getElementById('field').onclick = click

    run()
}

function run() {
    var nowtime = new Date().getTime()
    var dt = (nowtime - lasttime)/(1000 * delay)

    var ctx = canvas('field')
    ctx.clearRect(0, 0, 1000, 1000)

    render(ctx)

    current.step(dt)


    lasttime = nowtime
    setTimeout(run, 28 * delay)
}

function draw_image(ctx, image) {
    if (!image.image)
        return

    ctx.save()
    ctx.translate(image.pos.x, image.pos.y)
    if (image.rot) ctx.rotate(image.rot)
    ctx.drawImage(image.image, 
                  -image.width/2, -image.height/2,
                  image.width, image.height)
    ctx.restore()
}

function render(ctx) {
    for (var z = 0; z < 10; z++) {
        for (var i = 0; i < elements.length; i++) {
            if ((elements[i].z == z || (!elements[i].z && !z)) &&
                elements[i].image)
                draw_image(ctx, elements[i])
        }

        for (var i = 0; i < images.length; i++) {
            if (images[i].z == z || (!images[i].z && !z))
                draw_image(ctx, images[i])
        }
    }
}

function click(event) {
    var x = event.clientX
    var y = event.clientY
    var pos = new Vec(x, y)
    var clicked = false

    for (var i = 0; i < elements.length; i++) {
        var ex = elements[i].pos.x
        var ey = elements[i].pos.y

        if (x > ex-elements[i].width/2 &&
            y > ey-elements[i].height/2 &&
            x < ex+elements[i].width/2 &&
            y < ey+elements[i].height/2) {
            
            elements[i].onclick(pos)
            clicked = true
        }
    }

    if (!clicked)
        current.click(pos);
}

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
    return ctx
}

function image(name) {
    var img = document.createElement('img')
    img.src = name

    img.onload = function() {
        var ctx = canvas(img.width, img.height)
        ctx.drawImage(img, 0, 0)

        var raw = ctx.getImageData(0, 0, img.width, img.height)
        var data = raw.data

        for (var i = 0; i < data.length; i+=4) {
            if (!data[i+0] && !data[i+1] && !data[i+2])
                data[i+3] = 0
        }
        
        raw.data = data
        ctx.putImageData(raw, 0, 0)

        img.onload = img.onload2
        img.src = ctx.canvas.toDataURL("image/png")
    }

    return img
}

function read(name) {
    var client = new XMLHttpRequest()
    client.open('GET', name)
    client.send()
    
    while (!client.status) {}
    return eval(client.responseText)
}
