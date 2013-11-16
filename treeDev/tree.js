
canvas.addEventListener('treeClick', function() { }, false);


treeInit()
{
 elements.push(
    {   
        image: img();
        x: 
        y:
        height:
        width:
        onclick: function (){this.image: image()};
    })
 images.push({
       image: img();
       x:
       y:
       width: 
       height: 
})   
 
}
treeClick()
{
    elem.addEventListener('treeClick', function(event)
     {
             var x = event.pageX - elemLeft;
             var y = event.pageY - elemTop;

    elements.forEach(function(element)
     {
          if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) 
             {
               // What happens when someone clicks on element 
               element.researching= true;
               // element.level++; This should tell the element that the next time around the next thing should be drawn
             }
     });

    }, false);

}

function treeDraw(var upgrade) //Draws the node at the specified coordinate
{
  ctx.drawImage(upgrade, upgrade.x, upgrade.y);

}
        
function tree(context) 
{
   for (var i=0; i<reserachTree.length; i+=1) //Loops through the entire upgrade library
    {
       if (component.researching) //If its being researched then draw it
        {
          treeDraw(component);
        }          
    }   

}
