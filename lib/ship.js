Ship = (function() {
    function Ship(race, mass, force, speed, x, y, hx, hy) {
        var race = 'data/races/' + race + '/' + race + '_Mini_Carrier.bmp'

        this.mass = mass
        this.m_force = force
        this.m_speed = speed

        this.pos = new Vec(x, y)
        this.vel = new Vec()
        this.head = hx ? new Vec(hx, hy).norm() : new Vec(0, -1)

        this.radsq = new Vec(18, 18).lensq()
        this.rad = Math.sqrt(this.radsq)

        this.image = {
            image: image(race),
            pos: this.pos,
            width: 36,
            height: 36,
        }

        this.add_stop()
    }

    Ship.prototype.select = function() {
        this.selected = true
    }

    Ship.prototype.stopdist = function(vel) {
        return ((vel?(vel*vel):this.vel.lensq())*this.mass) / (2*this.m_force)
    }

    Ship.prototype.step = function(dt, debug) {
        if (debug) {
            debug.save()
            debug.translate(this.pos.x, this.pos.y)
        }

        var dir = this.task(dt, debug)

        //cap at max force
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

        //find new velocity
        dir = this.vel.add(dir.scale(dt/this.mass))

        //cap angular velocity
        var m_spin = (this.m_speed / this.rad) * dt


        if (dir.angle(this.head) > m_spin) {
            this.head = this.head.rotate(m_spin)
            this.vel = this.head.scale(dir.dot(this.head))
        } else if (dir.angle(this.head) < -m_spin) {
            this.head = this.head.rotate(-m_spin)
            this.vel = this.head.scale(dir.dot(this.head))
        } else if (this.vel.lensq() != 0) {
            this.head = dir.norm()
            this.vel = dir
        } else {
            this.vel = dir
        }

        //cap linear velocity
        if (this.vel.lensq() > this.m_speed*this.m_speed)
            this.vel = this.vel.norm().scale(this.m_speed)

        //update position
        this.pos = this.pos.add(dir.scale(dt))

        if (debug) {
            debug.beginPath()
            debug.strokeStyle = 'green'
            debug.arc(0, 0, this.rad, 0, 0, 2*Math.PI)
            debug.stroke()
            debug.closePath()

            debug.beginPath()
            debug.strokeStyle = 'blue'
            debug.moveTo(0, 0)
            debug.lineTo(this.vel.x/this.m_speed*this.rad, 
                         this.vel.y/this.m_speed*this.rad)
            debug.stroke()
            debug.closePath()

            debug.restore()
        }

        //update image
        this.image.pos = this.pos
        this.image.rot = this.head.angle(new Vec(0, -1))

        //update ui if selected
        if (this.selected)
            ui_update(this.pos)
    }

    Ship.prototype.add_stop = function() {
        this.task = function() {
            return new Vec()
        }
    }

    Ship.prototype.add_waypoint = function(target) {
        this.task = function(dt, debug) {
            var dir = target.sub(this.pos)

            if (debug) {
                debug.beginPath()
                debug.strokeStyle = 'purple'
                debug.arc(dir.x, dir.y, 8, 0, 2*Math.PI)
                debug.stroke()
                debug.closePath()
            }

            dir = dir.norm().scale(this.m_speed)
            dir = dir.sub(this.vel).scale(this.mass / dt)

            return dir
        }
    }

    Ship.prototype.add_endpoint = function(target) {
        this.task = function(dt, debug) {
            var dir = target.sub(this.pos)

            if (debug) {
                debug.beginPath()
                debug.strokeStyle = 'purple'
                debug.arc(dir.x, dir.y, 8, 0, 2*Math.PI)
                debug.stroke()
                debug.closePath()

                debug.beginPath()
                debug.strokeStyle = 'white'
                debug.arc(dir.x, dir.y, this.stopdist(this.m_speed), 0, 2*Math.PI)
                debug.stroke()
                debug.closePath()
            }

            dir = dir.norm().scale(this.m_speed)
            dir = dir.scale(this.pos.dist(target) / this.stopdist(this.m_speed))
            dir = dir.sub(this.vel).scale(this.mass / dt)

            return dir
        }
    }

    Ship.prototype.add_target = function(enemy) {
        this.task = function(dt, debug) {
            var t = this.pos.dist(enemy.pos) / this.m_speed
            var dir = enemy.pos.add(enemy.vel.scale(t))
            dir = dir.sub(this.pos)

            
            if (debug) {
                debug.beginPath()
                debug.strokeStyle = 'purple'
                debug.arc(dir.x, dir.y, 8, 0, 2*Math.PI)
                debug.stroke()
                debug.closePath()
            }

            dir = dir.scale(1/t)
            dir = dir.sub(this.vel).scale(this.mass / dt)

            return dir
        }
    }

    return Ship
})();
