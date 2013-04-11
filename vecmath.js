
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

    return obj
}

function distsq(vec0, vec1) {
    var x = (vec1.x-vec0.y)
    var y = (vec1.x-vec0.y)
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

function interpolate(vec0, vec1, ratio) {
    return vec0.scale(1-ratio).add(vec1.scale(ratio))
}
