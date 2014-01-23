//type vec {
//  x: 0,
//  y: 0
//}

var vec = (function() {
    var eps = 0.0001

    function vec(x, y) {
        if (x instanceof Object)
            return {x:x.x, y:x.y}
        else if (x instanceof Array)
            return {x:x[0], y:x[1]}
        else
            return {x:x||0, y:y||0}
    }

    vec.lensq = function(v) {
        return v.x*v.x + v.y*v.y
    }

    vec.len = function(v) {
        return Math.sqrt(vec.lensq(v))
    }

    vec.norm = function(v) {
        var len = vec.len(v)
        return vec(v.x/len, v.y/len)
    }

    vec.zero = function(v) {
        return Math.abs(vec.lensq(v)) < eps
    }

    vec.eq = function(v, s) {
        return Math.abs(vec.distsq(v, s)) < eps
    }

    vec.add = function(v, s) {
        if (s instanceof Object)
            return vec(v.x+s.x, v.y+s.y)
        else
            return vec(v.x+s, v.y+s)
    }

    vec.sub = function(v, s) {
        if (s instanceof Object)
            return vec(v.x-s.x, v.y-s.y)
        else
            return vec(v.x-s, v.y-s)
    }

    vec.dot = function(v, s) {
        return v.x*s.x + v.y*s.y
    }

    vec.scale = function(v, s) {
        return vec(s*v.x, s*v.y)
    }

    vec.distsq = function(v, s) {
        var x = s.x-v.x
        var y = s.y-v.y
        return x*x + y*y
    }

    vec.dist = function(v, s) {
        return Math.sqrt(vec.distsq(v, s))
    }

    vec.rotate = function(v, ang) {
        var cs = Math.cos(ang)
        var sn = Math.sin(ang)
        return vec(v.x*cs - v.y*sn, v.x*sn + v.y*cs)
    }

    vec.angle = function(v, s) {
        return -Math.atan2(-v.y*s.x + v.x*s.y, vec.dot(v, s))
    }

    vec.projectunit = function(v, s) {
        var len = vec.dot(v, s)
        return vec(len*s.x, len*s.y)
    }

    vec.project = function(v, s) {
        var len = vec.dot(v, s) / vec.lensq()
        return vec(len*s.x, len*s.y)
    }

    vec.lerp = function(v0, v1, ratio) {
        return vec.add(vec.scale(v0, 1-ratio), vec.scale(v1, ratio))
    }

    vec.bezier = function(v0, v1, v2, v3, ratio) {
        var mid = vec.lerp(v1, v2, ratio)

        return vec.lerp(
            vec.lerp(vec.lerp(v0, v1, ratio), mid, ratio),
            vec.lerp(mid, vec.lerp(v2, v3, ratio), ratio), ratio
        )
    }

    vec.hermite = function(v0, m0, v1, m1, t) {
        return (vec.add(vec.add(vec.add(
            vec.scale(v0, 2*t*t*t - 3*t*t + 1),
            vec.scale(m0, t*t*t - 2*t*t + t),
            vec.scale(v1, -2*t*t*t + 3*t*t),
            vec.scale(m1, t*t*t - t*t)
        ))))
    }

    return vec
})();


var mutvec = (function() {
    function mutvec(x, y) {
        return vec(x, y)
    }

    mutvec.norm = function(d, v) {
        var len = vec.len(v)
        d.x = v.x/len
        d.y = v.y/len
    }

    mutvec.add = function(d, v, s) {
        if (s instanceof Object) {
            d.x = v.x+s.x
            d.y = v.y+s.y
        } else {
            d.x = v.x+s
            d.y = v.y+s
        }
    }

    mutvec.sub = function(d, v, s) {
        if (s instanceof Object) {
            d.x = v.x-s.x
            d.y = v.y-s.y
        } else {
            d.x = v.x-s
            d.y = v.y-s
        }
    }

    mutvec.scale = function(d, v, s) {
        d.x = s*v.x
        d.y = s*v.y
    }

    mutvec.rotate = function(d, v, ang) {
        var cs = Math.cos(ang)
        var sn = Math.sin(ang)
        d.x = v.x*cs - v.y*sn
        d.y = v.x*sn + v.y*cs
    }

    mutvec.projectunit = function(d, v, s) {
        var len = vec.dot(v, s)
        d.x = len*s.x
        d.y = len*s.y
    }

    mutvec.project = function(d, v, s) {
        var len = vec.dot(v, s) / vec.lensq()
        d.x = len*s.x
        d.y = len*s.y
    }

    mutvec.lerp = function(d, v0, v1, ratio) {
        d.x = v0.x*(1-ratio) + v1.x*ratio
        d.y = v0.y*(1-ratio) + v1.y*ratio
    }

    return mutvec
})();
