//creates all colorbar components and appends them to the color bar list container
function create_colorbar(colorbar_list_div,algorithm_index,dim4,colorList){
  let canvas = document.createElement('canvas');

  canvas.classList.add('colobar');

  canvas.width = 50;
  canvas.height = 600;
  canvas.style = 'background-image: linear-gradient(' + colorList[colorList.length - 1] +','+ colorList[0] +'); margin:20px';


  colorbar_list_div.appendChild(canvas);

  // if there is a colorbar status displayed then reorder it to be the last element
  if (colorbar_list_div.getElementsByClassName('status')[0]) {
    event_get_color(canvas,algorithm_index,dim4,colorbar_list_div.getElementsByClassName('status')[0]);
    colorbar_list_div.appendChild(colorbar_list_div.getElementsByClassName('status')[0]);
  }
  else {
    let status = document.createElement('div');
    status.classList.add('status');
    status.innerHTML = 'hover your mouse'
    colorbar_list_div.appendChild(status);

    event_get_color(canvas,algorithm_index,dim4,status);
  }
}

//retracts the value of a color by normalizing the length of the color bar and position of the mouse
function event_get_color(colorbar,alg_index,dim4,status){

  let data = Algorithms_data[alg_index][dim4];
  let max = Math.max.apply(Math,data);
  let min = Math.min.apply(Math,data);

  colorbar.addEventListener('mousemove', e=>{

    var pos = findPos(colorbar);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;

    let normalized_y = (y * max)/colorbar.height

    var coord = Dimensions_names[dim4] + " = " + normalized_y.toFixed(4);

    status.innerHTML = coord;

  });
}

//finds position of the colorbar
function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return { x: curleft, y: curtop };
}

//translates rgb colors for its' hexadecimal keyCode
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

//creates list of colorbars container
function create_bars(graph_div){
  var dim4graph = document.createElement('div');
  dim4graph.classList.add('dim4graph');

  var div_parent = graph_div.parentNode;

  dim4graph.appendChild(graph_div);

  div_parent.appendChild(dim4graph);

  var colorbar_list = document.createElement('div');
  colorbar_list.classList.add('colorbar_list');

  dim4graph.appendChild(colorbar_list);

  return colorbar_list;
}
