//type mesh {
//  nodes: [ // note that this is a sparse array
//    node..
//  ]
// 
//  next: int
//  length: int
//}

//type node {
//  pos: vec
//  ref: int
//  nbors: [int, int, int, int]
//}

var mesh = (function() {
    function mesh(src) {
        if (src instanceof Object) {
            return {
                nodes: src.nodes.slice(),
                next: src.next,
                length: src.length
            }
        } else {
            return {
                nodes: [],
                next: 0,
                length: 0
            }
        }
    }

    function op(i) {
        return ~i & 0x3
    }

    mesh.for = function(m, cb) {
/*        var nodes = m.nodes

        for (var i = nodes.length-1; i >= 0; --i) {
            var node = nodes[i]

            if (node)
                cb(node)
        }*/

        m.nodes.forEach(cb)
    }

    mesh.insert = function(m, node) {
        var nbors = [-1, -1, -1, -1]
        var dists = [Infinity, Infinity, 
                     Infinity, Infinity]

        node.ref = m.next++
        node.nbors = nbors

        mesh.for(m, function(nbor) {
            var i = ((nbor.pos.x > node.pos.x) << 1 |
                     (nbor.pos.y > node.pos.y))

            var distsq = vec.distsq(nbor.pos, node.pos)

            if (distsq < dists[i] && distsq != 0) {
                nbors[i] = nbor.ref
                dists[i] = distsq
            }
        })

        for (var i = 0; i < nbors.length; i++) {
            if (nbors[i] < 0) continue
            var nbor = m.nodes[nbors[i]]
            if (nbor.nbors[op(i)] < 0) continue
            var nbnbor = m.nodes[nbor.nbors[op(i)]]

            if (dists[i] < vec.distsq(nbnbor.pos, nbor.pos))
                nbor.nbors[op(i)] = node.ref
        }

        m.nodes[node.ref] = node
        m.length++
        return node.ref
    }

    mesh.debug = function(m) {
//        for (var j = 0; j < m.nodes.length; j++) {
//            var node = m.nodes[j]
//
//            if (!node)
//                continue
//
        if (!debug.mesh)
            return

        mesh.for(m, function(node) {
            for (var i = 0; i < node.nbors.length; i++) {
                if (node.nbors[i] < 0)
                    continue

                debug.line(node.pos, 
                           m.nodes[node.nbors[i]].pos,
                           'green')
            }
        })
    }

    return mesh
})();
