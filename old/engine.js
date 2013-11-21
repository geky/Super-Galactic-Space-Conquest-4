
var mothership
var fighter

var lasttime

var field

var planets
var ships

var delay


function init(d) {
    mothership = ship('Terran', 40, 40, 20, 300, 50)
    fighter = ship('Krill', 100, 40, 20, 300, 50)

    ships = [mothership, fighter]

    lasttime = new Date().getTime()
    field = canvas('field')

    delay = d ? d : 1

    document.getElementById('field').onclick = function clickhandle(ev) {
        if (!ev.ctrlKey)
            fighter.add_target(mothership)
        else
            mothership.add_endpoint(vec(ev.clientX, ev.clientY))
    }

    run()
}

function run() {
    var nowtime = new Date().getTime()
    var dt = (nowtime - lasttime)/(1000 * delay)

    var ctx = canvas('field')
    ctx.clearRect(0, 0, 1000, 1000)

    for (var i=0; i<ships.length; i++) {
        ships[i].draw(field)

        ships[i].step(dt, field)

    }

    lasttime = nowtime
    setTimeout(run, 28 * delay)
}


function ship(race, x, y, mass, force, speed, hx, hy) {
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

    obj.stopdist = function(vel) {
        return ((vel? (vel*vel) : this.vel.lensq())*this.mass) / (2*this.m_force)
    }

    obj.draw = function(ctx) {
        ctx.save()
        ctx.translate(this.pos.x, this.pos.y)
        ctx.rotate(angle(this.head, vec(0, -1)))
        ctx.drawImage(this.img, -18, -18, 36, 36)
        ctx.restore()
    }

    obj.step = function(dt, debug) {
        if (debug) {
            debug.save()
            debug.translate(this.pos.x, this.pos.y)
        }

        // Find tasks steering force
        var dir = vec(0,0)

        if (this.tasks.length >= 1) {
            if (this.tasks[0].done(this, dt, debug))
                this.tasks.shift()
            else
                dir = this.tasks[0].dir(this, dt, debug)
        }


        // cap at max force
        if (dir.lensq() > this.m_force*this.m_force)
            dir = dir.norm().scale(this.m_force)


        if (debug) {
            debug.beginPath()
            debug.strokeStyle = 'red'
            debug.moveTo(0,0)
            debug.lineTo(dir.x/this.m_force*this.rad, dir.y/this.m_force*this.rad)
            debug.stroke()
            debug.closePath()
        }


        // find new theoretical velocity
        dir = this.vel.add(dir.scale(dt/this.mass))
        
        // cap angular velocity
        var m_spin = (this.m_speed / this.rad) * dt

        if (angle(dir, this.head) > m_spin) {
            this.head = this.head.rotate(m_spin)
            this.vel = this.head.scale(dot(dir, this.head))

        } else if (angle(dir, this.head) < -m_spin) {
            this.head = this.head.rotate(-m_spin)
            this.vel = this.head.scale(dot(dir, this.head))

        } else if (this.vel.lensq() != 0) {
            this.head = dir.norm()
            this.vel = dir 

        } else {
            this.vel = dir 
        }


        // cap linear velocity
        if (this.vel.lensq() > this.m_speed*this.m_speed)
            this.vel = this.vel.norm().scale(this.m_speed)


        // update position
        this.pos = this.pos.add(dir.scale(dt))

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

    obj.add_waypoint = function(targ) {
        this.tasks.push({
            dir: function(sh, dt, debug) {
                var dir = targ.sub(sh.pos)

                if (debug) {
                    debug.beginPath()
                    debug.strokeStyle="purple"
                    debug.arc(dir.x, dir.y, 8, 0, 2*Math.PI)
                    debug.stroke()
                    debug.closePath()
                }

                dir = dir.norm().scale(sh.m_speed)
                dir = dir.sub(sh.vel).scale(sh.mass / dt)

                return dir
            },

            done: function(sh, dt, debug) {
                return targ.sub(sh.pos).lensq() < 5
            }
        })
    }

    obj.add_endpoint = function(targ) {
        this.tasks.push({
            dir: function(sh, dt, debug) {
                var dir = targ.sub(sh.pos)

                if (debug) {
                    debug.beginPath()
                    debug.strokeStyle="purple"
                    debug.arc(dir.x, dir.y, 8, 0, 2*Math.PI)
                    debug.stroke()
                    debug.closePath()

                    debug.beginPath()
                    debug.strokeStyle="white"
                    debug.arc(dir.x, dir.y, sh.stopdist(sh.m_speed), 0, 2*Math.PI)
                    debug.stroke()
                    debug.closePath()
                }

                dir = dir.norm().scale(sh.m_speed)
                dir = dir.scale(dist(sh.pos, targ) / sh.stopdist(sh.m_speed))
                dir = dir.sub(sh.vel).scale(sh.mass / dt)

                return dir
            },

            done: function(sh, dt, debug) {
                return (targ.sub(sh.pos).lensq() < 5) && (sh.vel.lensq() < 1)
            }
        })
    }

    obj.add_target = function(enemy) {
        this.tasks.push({
            dir: function(sh, dt, debug) {
                var t = dist(sh.pos, enemy.pos)/sh.m_speed
                var dir = enemy.pos.add(enemy.vel.scale(t))
                dir = dir.sub(sh.pos)

                if (debug) {
                    debug.beginPath()
                    debug.strokeStyle="purple"
                    debug.arc(dir.x, dir.y, 8, 0, 2*Math.PI)
                    debug.stroke()
                    debug.closePath()
                }

                dir = dir.scale(1/t)
                dir = dir.sub(sh.vel).scale(sh.mass / dt)

                return dir
            },

            done: function(sh, dt, debug) {
                return (enemy.pos.sub(sh.pos).lensq() < 5)
            }
        })
    }

    return obj
}
