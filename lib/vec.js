
var Vec = (function() {
    function Vec(x, y) {
        if (x == undefined) {
            this.x = 0
            this.y = 0
        } else if (y == undefined) {
            this.x = x.x
            this.y = x.y
        } else {
            this.x = x
            this.y = y
        }
    }

    Vec.prototype.lensq = function() {
        return this.x*this.x + this.y*this.y
    }

    Vec.prototype.length = function() {
        return Math.sqrt(this.lensq())
    }

    Vec.prototype.add = function(other) {
        if (other instanceof Object)
            return new Vec(this.x+other.x, this.y+other.y)
        else
            return new Vec(this.x+other, this.y+other)
    }

    Vec.prototype.sub = function(other) {
        if (other instanceof Object)
            return new Vec(this.x-other.x, this.y-other.y)
        else
            return new Vec(this.x-other, this.y-other)
    }

    Vec.prototype.scale = function(s) {
        return new Vec(s*this.x, s*this.y)
    }

    Vec.prototype.norm = function() {
        var len = this.length()
        return new Vec(this.x/len, this.y/len)
    }

    Vec.prototype.rotate = function(ang) {
        var cs = Math.cos(ang)
        var sn = Math.sin(ang)

        return new Vec(this.x*cs - this.y*sn, this.x*sn + this.y*cs)
    }

    Vec.prototype.distsq = function(other) {
        var x = other.x-this.x
        var y = other.y-this.y

        return x*x + y*y
    }

    Vec.prototype.dist = function(other) {
        return Math.sqrt(this.distsq(other))
    }

    Vec.prototype.dot = function(other) {
        return this.x*other.x + this.y*other.y
    }

    Vec.prototype.angle = function(other) {
        return -Math.atan2(-this.y*other.x + this.x*other.y, this.dot(other))
    }

    Vec.lerp = function(v0, v1, ratio) {
        return v0.scale(1-ratio).add(v1.scale(ratio))
    }

    Vec.bezier = function(v0, v1, v2, v3, ratio) {
        var mid = Vec.lerp(v1, v2, ratio)

        return Vec.lerp(
            Vec.lerp(Vec.lerp(v0, v1, ratio), mid, ratio),
            Vec.lerp(mid, Vec.lerp(v2, v3, ratio), ratio), ratio
        )
    }

    Vec.hermite = function(v0, m0, v1, m1, t) {
        return (
            v0.scale(2*t*t*t - 3*t*t + 1).add(
            m0.scale(t*t*t - 2*t*t + t).add(
            v1.scale(-2*t*t*t + 3*t*t).add(
            m1.scale(t*t*t - t*t)
        ))))
    }

    return Vec
})();
