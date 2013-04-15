
var mothership
var lasttime
var field

var planets

var delay


function init(d) {
    mothership = ship('Terran', 40, 40, 20, 300, 50)
    lasttime = new Date().getTime()
    field = canvas('field')

    delay = d ? d : 1

    document.getElementById('field').onclick = function clickhandle(ev) {
        if (!ev.ctrlKey)
            mothership.bpoint(vec(ev.clientX, ev.clientY), vec(mothership.m_speed, 0))
        else
            mothership.waypoint(vec(ev.clientX, ev.clientY))
    }

    run()
}

function run() {
    var nowtime = new Date().getTime()
    var dt = (nowtime - lasttime)/(1000 * delay)

    var ctx = canvas('field')
    ctx.clearRect(0, 0, 1000, 1000)
    mothership.draw(field)

    mothership.step(dt, field)

    mothership.prestep(10)
    mothership.select(field)

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
        tasks: []
    }


    obj.draw = function(ctx) {
        ctx.save()
        ctx.translate(this.pos.x, this.pos.y)
        ctx.rotate(angle(this.head, vec(0, -1)))
        ctx.drawImage(this.img, -18, -18, 36, 36)
        ctx.restore()
    }

    obj.select = function(ctx) {
        if (!this.path)
            return

        ctx.beginPath()
        ctx.strokeStyle = 'white'
        ctx.moveTo(this.pos.x, this.pos.y)

        for (var i=0; i<this.path.length; i++) {
            ctx.lineTo(this.path[i].pos.x, this.path[i].pos.y)

            old = this.path[i]
        }

        ctx.stroke()
        ctx.closePath()
    }

    obj.prestep = function(time) {
        this.path = []

        var old = {
            pos: this.pos,
            vel: this.vel,
            head: this.head,
            tasks: this.tasks.slice(0)
        }

        for (var i=0; i<time*(1000/28); i++) {
            this.step(28/(1000*delay))
            this.path.push({
                pos: this.pos,
                vel: this.vel,
                head: this.head,
            })
        }

        this.pos = old.pos
        this.vel = old.vel
        this.head = old.head        
        this.tasks = old.tasks
    }

    obj.poststep = function() {

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
                this.tasks.splice(0, 1)
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

    obj.waypoint = function(targ) {
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

    obj.endpoint = function(targ) {
        this.tasks.push({
            stopdist: (this.m_speed*this.m_speed*this.mass) / (2*this.m_force),

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
                    debug.arc(dir.x, dir.y, this.stopdist, 0, 2*Math.PI)
                    debug.stroke()
                    debug.closePath()
                }

                dir = dir.norm().scale(sh.m_speed)

                if (distsq(sh.pos, targ) < this.stopdist*this.stopdist) {
                    dir = dir.scale(dist(sh.pos, targ) / this.stopdist)
                }

                dir = dir.sub(sh.vel).scale(sh.mass / dt)

                return dir
            },

            done: function(sh, dt, debug) {
                return (targ.sub(sh.pos).lensq() < 5) && (sh.vel.lensq() < 1)
            }
        })
    }

    obj.bpoint = function(targ, tvel) {
        this.tasks.push({
            dir: function(sh, dt, debug) {
                if (debug) {
                    var dir = targ.sub(sh.pos)

                    debug.beginPath()
                    debug.strokeStyle="purple"
                    debug.arc(dir.x, dir.y, 8, 0, 2*Math.PI)
                    debug.stroke()
                    debug.closePath()

                    debug.beginPath()
                    debug.strokeStyle="magenta"
                    debug.moveTo(0,0)
                    debug.bezierCurveTo(sh.vel.x*3, sh.vel.y*3,
                                        dir.x-tvel.x*3, dir.y-tvel.y*3,
                                        dir.x, dir.y)
                    debug.stroke()
                    debug.closePath()
                }

                var dir = hermitep(sh.pos, sh.vel, targ, tvel, 0).scale(dt*dt).add( 
                          hermitepp(sh.pos, sh.vel, targ, tvel, 0).scale(dt*dt/2))

                dir = hermite_dist(sh.pos, sh.vel, targ, tvel, dir.length())

                if (debug) {
                    debug.beginPath()
                    debug.strokeStyle="purple"
                    debug.arc(hermite(sh.pos, sh.vel, targ, tvel, dir).sub(sh.pos).x, 
                              hermite(sh.pos, sh.vel, targ, tvel, dir).sub(sh.pos).y, 
                              8, 0, 2*Math.PI)
                    debug.stroke()
                    debug.closePath()
                }

                dir = hermitep(sh.pos, sh.vel, targ, tvel, dir)

                dir = dir.sub(sh.vel).scale(sh.mass / dt)

                return dir
            },

            done: function(sh, dt, debug) {
                return (targ.sub(sh.pos).lensq() < 5)
            }
        })
    }

    return obj
}
