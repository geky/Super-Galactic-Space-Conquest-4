
var mothership
var lasttime
var field


function init() {
    mothership = ship('Terran', 40, 40, 10, 100, 50)
    lasttime = new Date().getTime()
    field = canvas('field')

    run()
}

function run() {
    var nowtime = new Date().getTime()
    var dt = (nowtime - lasttime)/1000

    var ctx = canvas('field')
    ctx.clearRect(0, 0, 1000, 1000)
    mothership.draw(field)

    mothership.step(dt, field)

    lasttime = nowtime
    setTimeout(run, 16)
}


function ship(race, x, y, mass, force, speed, hx, hy) {
    if (race == undefined) 
        race = 'Terran'

    race = 'data/races/' + race + '/' +
           race + '_Mini_Carrier.bmp'

    if (hx == undefined)
        hx = vec(0,-1)
    else 
        hx = vec(hx, hy).norm()

    var radsq = vec(18, 18).lensq()

    var obj = {
        mass:  mass,
        m_force: force,
        m_speed: speed,

        pos:   vec(x, y),
        vel:   vec(0,0),
        head:  hx,

        rad: Math.sqrt(radsq),
        radsq: radsq,

        img:   image(race),
        tasks: [],
    }


    obj.draw = function(ctx) {
        ctx.save()
        ctx.translate(this.pos.x, this.pos.y)
        ctx.rotate(angle(this.head, vec(0, -1)))
        ctx.drawImage(this.img, -18, -18, 36, 36)
        ctx.restore()
    }

    obj.select = function(ctx) {

    }

    obj.step = function(dt, debug) {
        if (this.tasks.length < 1)
            return

        if (debug) {
            debug.save()
            debug.translate(this.pos.x, this.pos.y)
        }

        var dest = this.tasks[0](this, debug)

        if (dest.dir.lensq() > this.m_force*this.m_force)
            dest.dir = dest.dir.norm().scale(this.m_force)

        if (debug) {
            debug.beginPath()
            debug.strokeStyle = 'red'
            debug.moveTo(0,0)
            debug.lineTo(dest.dir.x/this.m_force*this.rad, dest.dir.y/this.m_force*this.rad)
            debug.stroke()
            debug.closePath()
        }

        this.vel = this.vel.add(dest.dir.scale(dt/this.mass))
        this.head = this.vel.norm()

        if (this.vel.lensq() > this.m_speed*this.m_speed)
            this.vel = this.vel.norm().scale(this.m_speed)

        this.pos = this.pos.add(this.vel.scale(dt))

        if (dest.done)
            this.tasks.splice(0, 1)

        if (debug) {
            debug.beginPath()
            debug.strokeStyle = 'green'
            debug.arc(0, 0, this.rad, 0, 2*Math.PI)
            debug.stroke()
            debug.closePath()

            debug.beginPath()
            debug.strokeStyle = 'blue'
            debug.moveTo(0,0)
            debug.lineTo(this.vel.x/this.m_speed*this.rad, this.vel.y/this.m_speed*this.rad)
            debug.stroke()
            debug.closePath()

            debug.restore()
        }
    }

    obj.waypoint = function(targ) {
        this.tasks.push(function(sh, debug) {
            var dir = targ.sub(sh.pos)
            var done = (dir.lensq() < sh.radsq)

            if (debug) {
                debug.beginPath()
                debug.strokeStyle="purple"
                debug.arc(dir.x, dir.y, 10, 0, 2*Math.PI)
                debug.stroke()
                debug.closePath()
            }

            dir = dir.norm().scale(sh.m_speed)
            dir = dir.sub(sh.vel).scale(sh.mass*sh.m_force/sh.m_speed)

            return { dir: dir, done: done }
        })
    }

    return obj
}
