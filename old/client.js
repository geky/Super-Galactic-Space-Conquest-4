
// Game object represents current game
var game = {
    init: function() {},
    step: function() {},
    render: function() {},

    width: window.innerWidth * 0.95,
    height: window.innerHeight * 0.95,
    debug: true,

    buttons: [],
    click: function() {},
}

// Game execution functions
function init() {
    game.lasttime = new Date().getTime()
    game.delay = 28

    game.init()

    run()
}

function run() {
    var nowtime = new Date().getTime()
    var dt = (nowtime - game.lasttime)/(1000 * delay)
    var ctx = canvas('game')

    ctx.clearRect(0, 0, game.width, game.height)

    game.render(ctx)
    game.step(dt)

    game.lasttime = nowtime
    setTimeout(run, game.delay)
}

////
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
////
function render(ctx) {
    for (var z = 0; z < 10; z++) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i] && (elements[i].z == z || (!elements[i].z && !z)) &&
                elements[i].image)
                draw_image(ctx, elements[i])
        }

        for (var i = 0; i < images.length; i++) {
            if (images[i] && (images[i].z == z || (!images[i].z && !z)))
                draw_image(ctx, images[i])
        }
    }
}

/*var cursor =  {
    visible: false,
    pos: new Vec(-200, -200),
    image: 'data/cursor-in-a-circle.bmp'
}*/

var firstClick = true;
var index

function click(event) {
    var x = event.clientX
    var y = event.clientY
    var pos = new Vec(x, y)
    var clicked = false

    //cursor.pos = pos

    if(firstClick) {
        index = images.push( {
            //image: image('data/cursor-in-a-circle.jpg'),
            image: image('data/misc/half_circle.bmp'),
            pos: pos,
            width: 25,
            height: 25
        }) - 1
        console.log(images+' '+index)
    } else {
        console.log(images+' '+index)
        images[index].pos = pos     
    }

    firstClick = false;
    
    for (var i = 0; i < elements.length; i++) {
        if (!elements[i]) continue

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

    // replace all black pixels with transparent
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
