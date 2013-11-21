var button_index = []
var image_index = []

var selected = null

function ui_init(){
   image_index = [ images.push({ pos: new Vec(12, 12),
                                 image: image("data/misc/half_circle.bmp"),
                                 width: 48,
                                 height: 48 }) - 1 ]
   button(new Vec(30, 30), "data/button_images/stop_button.bmp", 48, 36, "data/button_images/stop_button_select.bmp") 
   button(new Vec(30, 78), "data/button_images/move_button.bmp", 48, 36, "data/button_images/move_button_select.bmp")
   button(new Vec(30, 126), "data/button_images/engage_button.bmp", 48, 36, "data/button_images/engage_button_select.bmp")
   button(new Vec(30, 174), "data/button_images/ram_button.bmp", 48, 36, "data/button_images/ram_button_select.bmp")
   button(new Vec(30, 222), "data/button_images/passive_button.bmp", 48, 36, "data/button_images/passive_button_select.bmp")
   button(new Vec(30, 270), "data/button_images/follow_button.bmp", 48, 36, "data/button_images/follow_button_select.bmp")
   button(new Vec(30, 318), "data/button_images/disband_button.bmp", 48, 36, "data/button_images/disband_button_select.bmp")
   button(new Vec(30, 366), "data/button_images/aggro_button.bmp", 48, 36, "data/button_images/aggro_button_select.bmp")
   button(new Vec(window.innerWidth - 200, 30), "data/button_images/submit_button.bmp", 48, 36, undefined, submit)
   button(new Vec(window.innerWidth - 150, 30), "data/button_images/replay_button.bmp", 48, 36)
   button(new Vec(window.innerWidth - 100, 30), "data/button_images/simulate_button.bmp", 48,36, undefined, simulate)
   no_select()
}

function set_selected(ship) {
    if (selected)
        selected.deselect()
  
    selected = ship
}

current.click = function(pos) {
    if (selected)
        selected.task = ['waypoint', pos.x, pos.y]
}

function no_select(){
    selected = null
    for(var i = 0; i < button_index.length - 3; i++){
        elements[button_index[i]].pos = new Vec(-200, -200)
    }
    images[image_index[0]].pos = new Vec(-200, -200)
}

function button(pos, img, wid, hght, img_sel, fn){
    button_index.push(
        elements.push({
        image: image(img),
        pos: pos,
        z: 2,
        width: wid,
        height: hght,
        selected: false,
        onclick: fn || function() { 
            this.selected = !this.selected
            if(this.selected){
                this.image = image(img_sel) 
            }else{
                this.image = image(img)
            }
        }}) - 1
    )
}

function ui_update(sel){
    if(current.step == sim) return

    images[image_index[0]].pos = new Vec(sel.x, sel.y)
    elements[button_index[0]].pos = new Vec(sel.x - 60, sel.y - 20)
    elements[button_index[1]].pos = new Vec(sel.x - 30, sel.y - 60)
    elements[button_index[2]].pos = new Vec(sel.x + 30, sel.y - 60)
    elements[button_index[3]].pos = new Vec(sel.x + 60, sel.y - 20)
    elements[button_index[4]].pos = new Vec(sel.x - 30, sel.y + 60)
    elements[button_index[5]].pos = elements[button_index[2]].pos
    elements[button_index[6]].pos = elements[button_index[3]].pos
    elements[button_index[7]].pos = new Vec(sel.x + 30, sel.y + 60)
}
