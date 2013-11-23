//type race {
//  designs: []
//  ships: []
//}

//type design {
//  image: image()
//  rad: vec.length(vec(18, 18))
//
//  mass: 100
//  force: 200
//  speed: 150
//}

//type ship {
//  des: 2
//
//  pos: vec()
//  vel: vec()
//  head: vec(0, 1)
//
//  task: 1
//  target: vec()
//}


ship = (function() {
    function ship(des, pos, vel, head) {
        if (des instanceof Object) {
            return {
                des: des.des,
                pos: des.pos,
                vel: des.vel,
                head: des.head,
                task: des.task,
                target: des.target,
            }
        } else {
            return {
                des: des,
                pos: pos || vec(),
                vel: vel || vec(),
                head: vec.norm(head || vec(0, 1)),
                task: 0,
            }
        }
    }

    var tasks = [
        /* stop = 0 */ function(target, ship, des, dt) {
            return vec.scale(ship.vel, -des.mass / dt)
        },

        /* waypoint = 1 */ function(target, ship, des, dt) {
            var dir = vec.sub(target, ship.pos)

            debug.circle(dir, des.rad, 'white')

            dir = vec.scale(vec.norm(dir), des.speed)
            dir = vec.scale(vec.sub(dir, ship.vel), des.mass / dt)
            return dir
        },

        /* endpoint = 2 */ function(target, ship, des, dt) {
            var dir = vec.sub(target, ship.pos)
            var sd = stopdist(des)

            debug.circle(dir, des.rad, 'white')
            debug.circle(dir, sd, 'purple')

            if (vec.lensq(dir) <= des.rad*des.rad) {
                ship.task = 0
                delete ship.target
            }

            dir = vec.scale(vec.norm(dir), des.speed)
            dir = vec.scale(dir, vec.dist(ship.pos, target) / sd)
            dir = vec.scale(vec.sub(dir, ship.vel), des.mass / dt)

            return dir
        },

        /* navpoint = 3 */ function(target, ship, des, dt) {
            var dir = vec.sub(target, ship.pos)
            var sd = stopdist(des)

            debug.circle(dir, des.rad, 'white')
            debug.circle(dir, sd, 'purple')

            dir = vec.scale(vec.norm(dir), des.speed)
            dir = vec.scale(dir, vec.dist(ship.pos, target) / sd)
            dir = vec.scale(vec.sub(dir, ship.vel), des.mass / dt)
            return dir
        },

        /* target = 4 */ function(target, ship, des, dt) {
            enemy = current.getship(target)

            var t = vec.dist(ship.pos, enemy.pos) / des.speed
            var dir = vec.add(enemy.pos, vec.scale(enemy.vel, t))
            dir = vec.sub(dir, ship.pos)

            debug.circle(dir, des.rad, 'white')

            dir = vec.scale(dir, 1/t)
            dir = vec.scale(vec.sub(dir, ship.vel), ship.mass / dt)
            return dir
        }
    ]



    function stopdist(des) {
        return ((des.speed*des.speed)*des.mass) / (2*des.force)
    }


    ship.step = function(ship, des, dt) {
        debug.push(ship.pos)

        var dir = tasks[ship.task](ship.target, ship, des, dt)

        //cap at max force
        if (vec.lensq(dir) > des.force*des.force)
            dir = vec.scale(vec.norm(dir), des.force)

        debug.vec(dir, des.force, des.rad, 'red')

        //find new velocity
        dir = vec.add(ship.vel, vec.scale(dir, dt/des.mass))

        //cap angular velocity
        var spin = (des.speed / des.rad) * dt
        var angle = vec.angle(dir, ship.head)

        if (vec.zero(dir)) {
            ship.vel = dir
        } else if (angle > spin) {
            ship.head = vec.rotate(ship.head, spin)
            ship.vel = vec.projectunit(dir, ship.head)
        } else if (angle < -spin) {
            ship.head = vec.rotate(ship.head, -spin)
            ship.vel = vec.projectunit(dir, ship.head)
        } else {
            ship.head = vec.norm(dir)
            ship.vel = dir
        }

        //cap linear velocity
        if (vec.lensq(ship.vel) > des.speed*des.speed)
            ship.vel = vec.scale(vec.norm(ship.vel), des.speed)

        //update position
        ship.pos = vec.add(ship.pos, vec.scale(ship.vel, dt))

        debug.vec(ship.vel, des.speed, des.rad, 'blue')
        debug.circle(vec(), des.rad, 'green')
        debug.pop()
    }

    ship.render = function(ship, des, ctx) {
        ctx.render(des.image, des.width, des.height, ship.pos, 
                   vec.angle(ship.head, vec(0,-1)))
    }

    return ship
})();
