

function effect_image(filename,slideNum) {
    var imageObj = image(filename);

    imageObj.onload2 = function() {
        console.log(imageObj.width + " " + imageObj.height)

        var sourceX = 72* slideNum;
        var sourceY = 0;
        var sourceWidth = 72;
        var sourceHeight = 72;
        var destWidth = sourceWidth;
        var destHeight = sourceHeight;
        var destX = 0 //ctx.width / 2 - destWidth / 2;
        var destY = 0 //ctx.height / 2 - destHeight / 2;

        var ctx = canvas(sourceWidth, sourceHeight);

        ctx.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

        imageObj.onload = function(){}
        imageObj.src = ctx.canvas.toDataURL("image/png")
        console.log(imageObj.src)
    }

    return imageObj
};


function gimmie(filename,num)
 {
    var imagObj=image(filename);
    imageObj.onload2 = function() {
    console.log(imageObj.width +" " + imageObj.height);

        // draw cropped image
        var sourceX = 0;
        var sourceY = 0;
        var sourceWidth = 20;
        var sourceHeight = 20;
        var destWidth = sourceWidth;
        var destHeight = sourceHeight;
        var destX = canvas.width / 2 - destWidth / 2;
        var destY = canvas.height / 2 - destHeight / 2;

        var ctx = canvas(sourceWidth, sourceHeight);
        ctx.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
        imageObj.onload = function(){}

        imageObj.scr =ctx.canvas.toDataURL("image/png");
        console.log(imageObj.scr)
      };
   
    return imagObj }
