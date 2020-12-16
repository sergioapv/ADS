function create_colorbar(colorbar_list_div,algorithm_index,dim4,colorList){
  let canvas = document.createElement('canvas');

  canvas.classList.add('colobar');

  canvas.width = 50;
  canvas.height = 500;
  canvas.style = 'background-image: linear-gradient(' + colorList[0] +','+ colorList[colorList.length - 1] +'); margin:20px';

  // // canvas.id = 'algorithm';
  let ctx = canvas.getContext('2d');
  //
  // var grd = ctx.createLinearGradient(0, 0, 200, 0);
  // grd.addColorStop(0, "red");
  // grd.addColorStop(1, "white");
  //
  // // Fill with gradient
  // ctx.fillStyle = grd;
  // ctx.fillRect(0, 0, 50, 500);

  event_get_color(canvas,algorithm_index,dim4);

  colorbar_list_div.appendChild(canvas);

  if (document.getElementById('status')) {
    document.getElementById('status').remove();
  }

  let status = document.createElement('div');
  status.classList.add('status');
  status.id = 'status';
  status.innerHTML = 'hover your mouse over a colorbar to see <br> the respective value'
  colorbar_list_div.appendChild(status);
}

function event_get_color(colorbar,alg_index,dim4){

  let data = Algorithms_data[alg_index][dim4];
  let max = Math.max.apply(Math,data);
  let min = Math.min.apply(Math,data);

  console.log(min);
  console.log(max);


  colorbar.addEventListener('mousemove', e=>{

    var pos = findPos(colorbar);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;

    let normalized_y = (y * max)/colorbar.height


    var coord = "value=" + normalized_y.toFixed(2);
    var c = colorbar.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data;
    // var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    document.getElementById("status").innerHTML = coord;

  });
}


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

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

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
