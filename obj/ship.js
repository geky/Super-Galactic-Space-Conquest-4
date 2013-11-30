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


    function waypoint(target, ship, des) {
        var dir = vec.sub(target, ship.pos)
        debug.circle(dir, des.rad, 'white')

        return vec.scale(vec.norm(dir), des.speed)
    }

    function endpoint(target, ship, des) {
        var dir = vec.sub(target, ship.pos)
        var sd = stopdist(des)

        debug.circle(dir, des.rad, 'white')
        debug.circle(dir, sd, 'purple')

        dir = vec.scale(vec.norm(dir), des.speed)
        dir = vec.scale(dir, vec.dist(ship.pos, target) / sd)
        return dir
    }

    function intercept(target, ship, des) {
        var t = vec.dist(ship.pos, enemy.pos) / des.speed
        var dir = vec.add(enemy.pos, vec.scale(enemy.vel, t))
        dir = vec.sub(dir, ship.pos)

        debug.circle(dir, des.rad, 'white')

        return vec.scale(dir, 1/t)
    }

    function avoid(others, ship, des) {
        var dir = vec()
        
        for (var i = 0; i < others.length; i++) {
            var spacesq = 2*des.rad
            spacesq = spacesq*spacesq
            var distsq = vec.distsq(ship.pos, others[i].pos)

            if (distsq < spacesq && distsq != 0) {
                var diff = vec.sub(ship.pos, others[i].pos)
                diff = vec.scale(vec.norm(diff), des.speed)
                diff = vec.scale(diff, 1 - (distsq/spacesq))

                dir = vec.add(dir, diff)
            }
        }

        return dir
    }
        
        

    var tasks = [
        /* stop = 0 */ function(target, ship, des) {
            return avoid(current.getallships(), ship, des)
        },

        /* goto = 1 */ function(target, ship, des) {
            var dir = avoid(current.getallships(), ship, des)
            dir = vec.add(dir, waypoint(target, ship, des))
            return dir
        }
    ]



    function stopdist(des) {
        return ((des.speed*des.speed)*des.mass) / (2*des.force)
    }


    ship.step = function(ship, des, dt) {
        debug.push(ship.pos)

        // find target vector
        var dir = tasks[ship.task](ship.target, ship, des, dt)

        // find steering force
        dir = vec.scale(vec.sub(dir, ship.vel), des.mass / dt)

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
