
function canvas(name) {
    var can = document.getElementById(name)
    if (!can) alert("HTLM5 not supported!")

    ctx = can.getContext('2d')
    ctx.width = can.width
    ctx.height = can.height
    return ctx
}

function image(name) {
    var img = document.createElement('img')
    img.src = name
    return img
}

function read(name) {
    var client = new XMLHttpRequest()
    client.open('GET', name)
    client.send()
    
    while (!client.status) {}
    return eval(client.responseText)
}
