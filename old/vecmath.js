
function canvas(name) {
    var ctx = document.getElementById(name)
    if (ctx) ctx = ctx.getContext('2d')
    return ctx
}

function image(name) {
    var img = document.createElement('img')
    img.src = name
    return img
}

function vec(x,y) {
    var obj

    if (x == undefined)
        obj = {x: 0,   y:0    }
    else if (y == undefined)
        obj = {x: x.x, y: x.y }
    else
        obj = {x: x,   y: y   }

    obj.lensq = function() {
        return this.x*this.x + this.y*this.y
    }

    obj.length = function() {
        return Math.sqrt(this.lensq())
    }

    obj.add = function(other) {
        if (other instanceof Object)
            return vec(this.x+other.x, this.y+other.y)
        else
            return vec(this.x+other, this.y+other)
    }

    obj.sub = function(other) {
        if (other instanceof Object)
            return vec(this.x-other.x, this.y-other.y)
        else
            return vec(this.x-other, this.y-other)
    }

    obj.scale = function(s) {
        return vec(s*this.x, s*this.y)
    }

    obj.norm = function() {
        var l = this.length()
        return vec(this.x/l, this.y/l)
    }

    obj.rotate = function(ang) {
        var cs = Math.cos(ang)
        var sn = Math.sin(ang)

        return vec(x*cs - y*sn, x*sn + y*cs)
    }

    return obj
}

function distsq(vec0, vec1) {
    var x = (vec1.x-vec0.x)
    var y = (vec1.y-vec0.y)
    return x*x + y*y
}

function dist(vec0, vec1) {
    return Math.sqrt(distsq(vec0, vec1))
}

function dot(vec0, vec1) {
    return vec0.x*vec1.x + vec0.y*vec1.y
}

function angle(vec0, vec1) {
    return -Math.atan2(-vec0.y*vec1.x + vec0.x*vec1.y, dot(vec0, vec1))
}

function lerp(vec0, vec1, ratio) {
    return vec0.scale(1-ratio).add(vec1.scale(ratio))
}

function bezier(p0, p1, p2, p3, t) {
    var mid = lerp(p1,p2,t)

    return lerp(
        lerp(lerp(p0,p1,t), mid, t),
        lerp(mid, lerp(p2,p3,t), t), t
    )
}

function hermite(p0, m0, p1, m1, t) {
    return (
        p0.scale(2*t*t*t - 3*t*t + 1).add(
        m0.scale(t*t*t - 2*t*t + t).add(
        p1.scale(-2*t*t*t + 3*t*t).add(
        m1.scale(t*t*t - t*t)
    ))))
}

function hermitep(p0, m0, p1, m1, t) {
    return (
        p0.scale(6*t*t - 6*t).add(
        m0.scale(3*t*t - 4*t + 1).add(
        p1.scale(-6*t*t + 6*t).add(
        m1.scale(3*t*t - 2*t)
    ))))
}

function hermitepp(p0, m0, p1, m1, t) {
    return (
        p0.scale(12*t - 6).add(
        m0.scale(6*t - 4).add(
        p1.scale(-12*t + 6).add(
        m1.scale(6*t - 2)
    ))))
}

function hermite_dist(p0, m0, p1, m1, dist, res) {
    if (!res) 
        res = 0.0001

    var t0 = 0
    var t1 = 1
    var mid

    do {
        var mid = (t1-t0)/2 + t0
        var actual = hermite(p0, m0, p1, m1, mid)

        if (actual.lensq() < dist*dist)
            t0 = mid
        else
            t1 = mid
    } while (t1 - t0 > res);

    return mid
}
