var lasttime
var delay


function init(d) {
    lasttime = new Date().getTime()
    delay = d ? d : 1
    run()
}

function run() {
    var nowtime = new Date().getTime()
    var dt = (nowtime - lasttime)/(1000 * delay)

    var ctx = canvas('field')
    ctx.clearRect(0, 0, 1000, 1000)

    tree(ctx);

    lasttime = nowtime
    setTimeout(run, 28 * delay)
}

