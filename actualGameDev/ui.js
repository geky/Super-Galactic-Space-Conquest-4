var button_index = []

function ui_init(sel){
   button(new Vec(sel.pos.x, sel.pos.y), "data/misc/half_circle.bmp", 48, 48)
   button(new Vec(30, 30), "data/button_images/stop_button.bmp", 48, 36, "data/button_images/stop_button_selected.bmp") 
   button(new Vec(30, 78), "data/button_images/move_button.bmp", 48, 36, "data/button_images/move_button_selected.bmp")
   button(new Vec(30, 126), "data/button_images/engage_button.bmp", 48, 36, "data/button_images/engage_button_selected.bmp")
   button(new Vec(30, 174), "data/button_images/ram_button.bmp", 48, 36, "data/button_images/ram_button_selected.bmp")
   button(new Vec(30, 222), "data/button_images/passive_button.bmp", 48, 36, "data/button_images/passive_button_selected.bmp")
   button(new Vec(30, 270), "data/button_images/follow_button.bmp", 48, 36, "data/button_images/follow_button_selected.bmp")
   button(new Vec(30, 318), "data/button_images/disband_button.bmp", 48, 36, "data/button_images/disband_button_selected.bmp")
   button(new Vec(30, 366), "data/button_images/aggro_button.bmp", 48, 36, "data/button_images/aggro_button_selected.bmp")
}

function button(pos, img, wid, hght, img_sel){
    button_index.push(
        elements.push({
        image: image(img),
        pos: pos,
        z: 2,
        width: wid,
        height: hght,
        onclick: function() { this.image = image(img_sel) }
        }) - 1
    )
}

function ui_update(sel){
    elements[button_index[0]].pos = new Vec(sel.x, sel.y)
    elements[button_index[1]].pos = new Vec(sel.x - 60, sel.y - 20)
    elements[button_index[2]].pos = new Vec(sel.x - 30, sel.y - 60)
    elements[button_index[3]].pos = new Vec(sel.x + 30, sel.y - 60)
    elements[button_index[4]].pos = new Vec(sel.x + 60, sel.y - 20)
    elements[button_index[5]].pos = new Vec(sel.x - 30, sel.y + 60)
    elements[button_index[6]].pos = elements[button_index[3]].pos
    elements[button_index[7]].pos = elements[button_index[4]].pos
    elements[button_index[8]].pos = new Vec(sel.x + 30, sel.y + 60)
}
