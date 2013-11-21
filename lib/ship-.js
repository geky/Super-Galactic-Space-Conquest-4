Ship = (function() {
    function Ship(race, mass, force, speed, x, y, hx, hy, vx, vy) {
        this.r = race
/*        if (race[0] == '!') {
            this.missile = true
            race = race.substring(1)
            race = 'data/races/' + race + '/' + race + '_Mini_Drone.bmp'
        }else{*/
            race = 'data/races/' + race + '/' + race + '_Mini_Carrier.bmp'
//        }
        var that = this

        this.mass = mass
        this.m_force = force
        this.m_speed = speed

        this.pos = new Vec(x, y)
        this.vel = vx ? new Vec(vx, vy) : new Vec()
        this.head = hx ? new Vec(hx, hy).norm() : new Vec(0, -1)

        this.radsq = new Vec(18, 18).lensq()
        this.rad = Math.sqrt(this.radsq)
        this.power = 3*this.rad
//        this.shoottt = this.missile ? Infinity : 0; 

        this.image = {
            image: image(race),
            pos: this.pos,
            width: 36,
            height: 36,
        }

        this.image_ref = images.push(this.image) - 1

        this.button = {
            pos: this.pos,
            width: this.rad*2,
            height: this.rad*2,
            onclick: function() {
                this.selected = false
                that.select()
            }
        }

        this.button_ref = elements.push(this.button) - 1

        this.task = ["stop"]
    }

    Ship.prototype.rm = function() {
        console.log(this)
        images[this.image_ref] = undefined
        elements[this.button_ref] = undefined
    }

    Ship.fromjson = function(race, json) {
        var ship = new Ship(
            race, json.mass, json.force, json.speed,
            json.pos.x, json.pos.y,
            json.head.x, json.head.y,
            json.vel.x, json.vel.y)

//        if (json.missile) ship.missile = true
        ship.task = json.task
        return ship
    }
        

    Ship.prototype.tojson = function() {
        return {
            mass: this.mass,
            force: this.m_force,
            speed: this.m_speed,
            pos: {x: this.pos.x, y: this.pos.y},
            head: {x: this.head.x, y: this.head.y},
            vel: {x: this.vel.x, y: this.vel.y},

//            missile: this.missile,
            task: this.task
        }
    }

    Ship.prototype.select = function() {
        this.selected = true
        ui_update(this.pos)
        set_selected(this)
    }

    Ship.prototype.deselect = function() {
        this.selected = false
    }

    Ship.prototype.stopdist = function(vel) {
        return ((vel?(vel*vel):this.vel.lensq())*this.mass) / (2*this.m_force)
    }

    Ship.prototype.step = function(dt, debug) {
        if (debug) {
            debug.save()
            debug.translate(this.pos.x, this.pos.y)
        }

        var dir = tasks[this.task[0]](this, this.task, dt, debug)

        //cap at max force
        if (dir.lensq() > this.m_force*this.m_force)
            dir = dir.norm().scale(this.m_force)

        if (debug) {
            debug.beginPath()
            debug.strokeStyle = 'red'
            debug.moveTo(0,0)
            debug.lineTo(dir.x/this.m_force*this.rad, 
                         dir.y/this.m_force*this.rad)
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

//        if (this.shoottt <= 0) {
//            var target = closest(this.pos)
//
//            if (target && target.pos.distsq(this.pos) < this.power*this.power) {
//                missile(this.r, this.pos,target)
//                this.shoottt = this.power
//            }
//        } else {
//            this.shoottt -= dt
//        }

        //update image
        this.image.pos = this.pos
        this.image.rot = this.head.angle(new Vec(0, -1))

        //shoot lasers
        for (var i = 0; i < state.player.ships.length; i++) {
            if (state.player.ships[i].pos.dist(this.pos) < this.power) {
                var ctx = canvas('field')
                ctx.beginPath()
                ctx.strokeStyle = 'red'
                ctx.moveTo(this.pos.x, this.pos.y)
                ctx.lineTo(state.player.ships[i].pos.x,
                           state.player.ships[i].pos.y)
                ctx.stroke()
                ctx.closePath()
            }
        }

        //update button for the ship
        this.button.pos = this.pos

        //update ui if selected
        if (this.selected)
            ui_update(this.pos)
    }

    var tasks = {
        stop: function() {
            return new Vec()
        },

        waypoint: function(ship, args, dt, debug) {
            var target = new Vec(args[1], arg[2])
            var dir = target.sub(ship.pos)

            if (debug) {
                debug.beginPath()
                debug.strokeStyle = 'purple'
                debug.arc(dir.x, dir.y, 8, 0, 2*Math.PI)
                debug.stroke()
                debug.closePath()
            }

            dir = dir.norm().scale(ship.m_speed)
            dir = dir.sub(ship.vel).scale(ship.mass / dt)

            return dir
        },

        endpoint: function(ship, args, dt, debug) {
            var target = new Vec(args[1], args[2])
            var dir = target.sub(ship.pos)

            if (debug) {
               debug.beginPath()
                debug.strokeStyle = 'purple'
                debug.arc(dir.x, dir.y, 8, 0, 2*Math.PI)
                debug.stroke()
                debug.closePath()

                debug.beginPath()
                debug.strokeStyle = 'white'
                debug.arc(dir.x, dir.y, ship.stopdist(ship.m_speed), 0, 2*Math.PI)
                debug.stroke()
                debug.closePath()
            }

            dir = dir.norm().scale(ship.m_speed)
            dir = dir.scale(ship.pos.dist(target) / ship.stopdist(ship.m_speed))
            dir = dir.sub(ship.vel).scale(ship.mass / dt)

            return dir
        },
    }
/*
        target: function(ship, args, dt, debug) {
            var enemy_race = args[1]
            var enemy_ind = args[2]
            var enemy = rget(

            enemy = rget(enemy_race).ships[enemy_ind]

            var t = ship.pos.dist(enemy.pos) / ship.m_speed
            var dir = enemy.pos.add(enemy.vel.scale(t))
            dir = dir.sub(ship.pos)

            
            if (debug) {
                debug.beginPath()
                debug.strokeStyle = 'purple'
                debug.arc(dir.x, dir.y, 8, 0, 2*Math.PI)
                debug.stroke()
                debug.closePath()
            }

            dir = dir.scale(1/t)
            dir = dir.sub(ship.vel).scale(ship.mass / dt)

            return dir
        }
    }*/

    return Ship
})();
