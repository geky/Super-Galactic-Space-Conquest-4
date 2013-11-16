

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
        var destX = 0
        var destY = 0 

        var ctx = canvas(sourceWidth, sourceHeight);

        ctx.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

        imageObj.onload = function(){}
        imageObj.src = ctx.canvas.toDataURL("image/png")
        console.log(imageObj.src)
    }

    return imageObj
};


function gimmie(filename,num) {
var col=0;
var row=num
if(num>9)
        {
            col=1;
            row=num%10;
        }   
        if(num>19)
       {
            col=2;
            row=num%10;
        }   
        if(num>29)
        {
            col=3;
            row=num%10;
        }     


 var imageObj = image(filename);

    imageObj.onload2 = function() {
        console.log(imageObj.width + " " + imageObj.height)


        var sourceX = 20*row;
        var sourceY = 20*col;
        var sourceWidth = 20;
        var sourceHeight = 20;
        var destWidth = sourceWidth;
        var destHeight = sourceHeight;
        var destX = 0 
        var destY = 0 

        var ctx = canvas(sourceWidth, sourceHeight);

        ctx.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

        imageObj.onload = function(){}
        imageObj.src = ctx.canvas.toDataURL("image/png")
        console.log(imageObj.src)
    }

    return imageObj
};

/*function pewpew(filename, num, times)
{
   for (var i=0; i<num; i+=1)
    {*/ 
  
 //       var ctx = canvas(sourceWidth, sourceHeight);
   //     gimme(filename, num);//)
/*    }
}*/


function pewpew(filename,num,times) {
var col=0;
var row=num
if(num>9)
        {
            col=1;
            row=num%10;
        }   
        if(num>19)
       {
            col=2;
            row=num%10;
        }   
        if(num>29)
        {
            col=3;
            row=num%10;
        }     


 var imageObj = image(filename);

    imageObj.onload2 = function() {
        console.log(imageObj.width + " " + imageObj.height)


        var sourceX = 20*row;
        var sourceY = 20*col;
        var sourceWidth = 20;
        var sourceHeight = 20;
        var destWidth = sourceWidth;
        var destHeight = sourceHeight;
        var destX = 0 
        var destY = 0 

        var ctx = canvas(sourceWidth, sourceHeight*times);
        for(var i =0;i<times;i++)
        {
           ctx.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX ,destY+(20+i), destWidth, destHeight);
        
        }           
        imageObj.onload = function(){}
        imageObj.src = ctx.canvas.toDataURL("image/png")
        console.log(imageObj.src)
    }

    return imageObj
};


