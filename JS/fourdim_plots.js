
function hexToRgb(hex){
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length== 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+')';
  }
  throw new Error('Bad Hex');
}

function append_plots(div){
  let parent = div.parentNode;

  var graph = document.createElement('div');
  graph.classList.add('graph')

  parent.appendChild(graph);

  return graph;
}

function getValueByColor(point_color, original_color, dim){
  let point_color_rgb = point_color.split('(')[1].split(')')[0].split(',')
  let original_color_rgb = hexToRgb(original_color).split('(')[1].split(')')[0].split(',')
  for(var i = 0; i<3; i++){
    point_color_rgb[i] = parseFloat(point_color_rgb[i])
    original_color_rgb[i] = parseFloat(original_color_rgb[i])
  }

  let normalized_value = point_color_rgb[0] - original_color_rgb[0] + 255/2

  let dimMin = Math.min.apply(Math,dim);
  let dimMax = Math.max.apply(Math,dim);

  let value = (normalized_value/255 * (dimMax-dimMin)) + dimMin

  return value


}

function colorRange(color, dim){
  let colorRangeList = [];
  var color = hexToRgb(color).split('(')[1].split(')')[0].split(',')
  for(var i = 0; i<3; i++){
    color[i] = parseInt(color[i])
  }

  let dimMin = Math.min.apply(Math,dim);
  let dimMax = Math.max.apply(Math,dim);

  for(let i = 0; i < dim.length; i++){
    let normalized_value = (dim[i] - dimMin)/(dimMax-dimMin)*255;

    let r = color[0] + (normalized_value - 255/2);
    let g = color[1] + (normalized_value - 255/2);
    let b = color[2] + (normalized_value - 255/2);

    if(r>255)   {r = 255;}
    else if(r<0){r = 0;}

    if(g>255)   {g = 255;}
    else if(g<0){g = 0;}

    if(b>255)   {b = 255;}
    else if(b<0){b = 0;}

    colorRangeList.push('rgb(' + r + ',' + g + ',' + b + ')');
  }
  return colorRangeList
}

function plot4dim(div, dims, chosen_algs, plotType){
  if (div.parentNode.parentNode.querySelector('.hypervolumes_list')) {
    div.parentNode.parentNode.querySelector('.hypervolumes_list').remove();
  }

  if (div.parentNode.parentNode.querySelector('.hypervolume_range_changer')) {
    div.parentNode.parentNode.querySelector('.hypervolume_range_changer').remove();
  }


  switch (plotType) {
    case 'scatter4d':{
      fourDimScatterPlot(div, dims, chosen_algs);
      break;
    }
    case 'paralelle':{
      fourDimParallel(div, dims, chosen_algs[0]);
      for (var i = 1; i < chosen_algs.length; i++) {
        let append_div = append_plots(div);
        fourDimParallel(append_div, dims, chosen_algs[i]);
      }
      break;
    }
  }
}

function create_fourDim_dropDown(icon, plot_title){
  let dropdown = document.createElement('div');
  dropdown.setAttribute('class', 'choose_four_dim');
  dropdown.setAttribute('style', 'visibility: hidden; z-index:99');

  let scatter4d = document.createElement('span');
  scatter4d.setAttribute('class', 'graphOption');
  scatter4d.setAttribute('id', 'scatter4d');
  scatter4d.setAttribute('name', 'fourDim');
  scatter4d.value = 'scatter4d';

  scatter4d.textContent = 'Scatter Plot 4D';
  dropdown.appendChild(scatter4d);

  let paralelle = document.createElement('span');
  paralelle.setAttribute('class', 'graphOption');
  paralelle.setAttribute('id', 'paralelle');
  paralelle.setAttribute('name', 'fourDim');
  paralelle.value = 'paralelle';

  paralelle.textContent = 'Paralelle Coordinates';
  dropdown.appendChild(paralelle);

  plot_title.appendChild(dropdown)

  createFourDimDropListner(icon, dropdown)
}

function createFourDimDropListner(icon,dropdown){
  console.clear();
  let options = dropdown.childNodes;
  for(let i = 0; i<options.length; i++){
    options[i].addEventListener('click', function(){
      let dim ='';
      let dimNames = dropdown.parentNode.getElementsByClassName('dim_title')[0].textContent.split(' vs ');
      let algs_chosen = dropdown.parentNode.getElementsByClassName('alg_title')[0].textContent.split(' vs ');
      let div = dropdown.parentNode.parentNode.getElementsByClassName('graphs_content')[0].getElementsByClassName('graph')[0];

      let plot_content = div.parentNode.parentNode;

      let graphs_content = div.parentNode;
      graphs_content.remove();

      let new_graphs_content = document.createElement('div');
      new_graphs_content.classList.add('graphs_content');

      let new_graph = document.createElement('div');
      new_graph.className = 'graph';

      plot_content.appendChild(new_graphs_content)
      new_graphs_content.appendChild(new_graph);

      plot4dim(new_graph, dimNames, algs_chosen, options[i].value)
    });
  }
  icon.addEventListener('click', function(){
    if(dropdown.style.visibility == 'hidden'){
      dropdown.style.visibility = 'visible';
      dropdown.style.height = '70px';
      dropdown.style.width = '240px';
      dropdown.style.padding = '.5em';
    }else{
      dropdown.style.visibility = 'hidden';
      dropdown.style.height = '0';
      dropdown.style.width = '0';
      dropdown.style.padding = '0';
    }
  });
}

function fourDimScatterPlot(div, dims, chosen_algs){
  let data = [];

  var colorbar_list = create_bars(div);

  dims = Array.from(dims);
  dim1 = elementIndex(Dimensions_names, dims[0]);
  dim2 = elementIndex(Dimensions_names, dims[1]);
  dim3 = elementIndex(Dimensions_names, dims[2]);
  dim4 = elementIndex(Dimensions_names, dims[3]);

  create_hypervolume_list(div,chosen_algs)
  create_range_changer_buttons(div,chosen_algs,dims)

  for(var i = 0; i < chosen_algs.length; i++){
    let algIndex = elementIndex(Algorithms_names, chosen_algs[i]);
    let value_color_range = colorRange(Algorithms_colors[algIndex], Algorithms_data[algIndex][dim4]);

    var trace1 = {
      name: chosen_algs[i],
      mode: 'markers',
      type: 'scatter3d',

      x: Algorithms_data[algIndex][dim1],
      y: Algorithms_data[algIndex][dim2],
      z: Algorithms_data[algIndex][dim3],
      hovertemplate: '<i>' + dims[0] +'</i>: %{x}'  +
                     '<br><i>' + dims[1] + '</i>: %{y}' +
                     '<br><i>' + dims[2] + '</i>: %{z}',// +
                     // '<br><i>' + dims[3] + '</i>: %{o} <br>',

    	marker: {
      	size: 3,
        color: value_color_range,
      },

    };
    data.push(trace1);
    update_hypervolume_value(div,chosen_algs[i],hyperVolume4D([Algorithms_data[algIndex][dim1], Algorithms_data[algIndex][dim2],Algorithms_data[algIndex][dim3],Algorithms_data[algIndex][dim4]]));
    create_colorbar(colorbar_list,algIndex,dim4,value_color_range);
  }

  var layout = {margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0
  },
  showlegend:true,
  scene: {
    xaxis:{title: dims[0]},

    yaxis:{title: dims[1]},

    zaxis:{title: dims[2]}},
  };

  Plotly.newPlot(div, data, layout);
  div.addEventListener('click', e => {
    div.once('plotly_click',
      function(data){
        console.log(data);
        let file = getFilePath(data.points[0].data.name, data.points[0].pointNumber)[0]
        let algIndex = elementIndex(chosen_algs, data.points[0].data.name)
        let sum = 0
        let interval = [];
        let opacityPoints = [];
        let borderColor = [];
        let pointswidth = [];
        console.log(algIndex);
        for (var i = 0; i < INDEXRECORDER[algIndex].length; i++) {
          sum += INDEXRECORDER[algIndex][i][0]
          if(file.includes(INDEXRECORDER[algIndex][i][1])){
            interval.push(sum - INDEXRECORDER[algIndex][i][0])
            interval.push(sum)
            break;
          }
        }

        console.log(interval);

        let x = []
        let y = []
        let color = colorRange(Algorithms_colors[algIndex], Algorithms_data[algIndex][elementIndex(Dimensions_names, dims[3])])
        for (var i = 0; i < Algorithms_data[algIndex][0].length; i++) {
          if (i >= interval[0] && i <= interval[1]){
            opacityPoints.push(1)
            borderColor.push('#ff0000')
          }else{
            opacityPoints.push(0.05)
            borderColor.push(color[i])

          }
        }

        let pointList = Object.values(data.points[0]);
        console.log(pointList);
        let point_color = color[pointList[6]]
        let original_color = Algorithms_colors[elementIndex(Algorithms_names, data.points[0].data.name)]
        let dim = Algorithms_data[elementIndex(Algorithms_names, data.points[0].data.name)][dim4]
        let fourDimPoint = getValueByColor(point_color, original_color, dim);
        var point = data.points[0],
            newAnnotation = {
              x: point.x,
              y: point.y,
              z: point.z,
              arrowhead: 6,
              ax: 0,
              ay: -150,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              arrowcolor: point_color,
              font: {size:12},
              bordercolor: point_color,
              borderwidth: 3,
              borderpad: 4,
              text:
                    '<b>Point Atributes</b><br><br>' +
                    '<b>' + dims[0] + '</b><br>'+(point.x) +
                    '<br><b>' + dims[1] + '</b><br>'+(point.y) +
                    '<br><b>' + dims[2] + '</b><br>'+(point.z) +
                    '<br><b>' + dims[3] + '</b><br>'+ fourDimPoint +
                    '<br><b>File Path</b>  <br>'+(getFilePath(point.data.name, point.pointNumber)[0]) +
                    '<br><b>Line</b>  <br>'+(getFilePath(point.data.name, point.pointNumber)[1])

          },
          newIndex = (div.layout.scene.annotations || []).length;
          console.log(newIndex);
          if(newIndex > 0) {
             var foundCopy = false;
             div.layout.scene.annotations.forEach(function(ann, sameIndex) {
               if(ann.text === newAnnotation.text ) {
                 let color = colorRange(Algorithms_colors[algIndex], Algorithms_data[algIndex][elementIndex(Dimensions_names, dims[3])])
                 Plotly.restyle(div,  {"marker.color": [color]}, elementIndex(chosen_algs, point.data.name) )
                 foundCopy = true;
               }
               Plotly.relayout(div, 'scene.annotations[' + sameIndex + ']', 'remove');
             });
             if(foundCopy){
               return;
             }
           }
           console.log(div.data);
           Plotly.relayout(div, 'scene.annotations['+ 0 + ']', 'remove');
           Plotly.relayout(div, 'scene.annotations[' + 0 + ']', newAnnotation);
           for (var i1 = 0; i1 < div.data.length; i1++) {
             let index = elementIndex(Algorithms_names, div.data[i1].name)
             let color = colorRange(Algorithms_colors[index], Algorithms_data[index][elementIndex(Dimensions_names, dims[3])])
             Plotly.restyle(div,  {"marker.color": [color]}, i1)
           }
           Plotly.restyle(div,  {"marker.color": [borderColor]}, elementIndex(chosen_algs, point.data.name) )


          })
          });

}
function fourDimParallel(div, dims, chosen_alg){

  var dimensions_ = [];


  for (var i = 0; i < dims.length; i++) {

    let dim = dims[i]

    let index_dim = Dimensions_names.indexOf(dim);
    let alg_index = Algorithms_names.indexOf(chosen_alg)
    let dim_data = Algorithms_data[alg_index][index_dim]

    let min = Math.min.apply(Math,dim_data);
    let max = Math.max.apply(Math,dim_data);

    let dim_adder = {
      range: [min,max],
      label: dim,
      values: dim_data
    }

    dimensions_.push(dim_adder);

  }

  var data = [{
    type: 'parcoords',
    name: chosen_alg,
    // pad: [80,80,80,80],
    line: {
      color: Algorithms_colors[Algorithms_names.indexOf(chosen_alg)],
      colorscale: [[0, 'red'], [0.5, 'green'], [1, 'blue']]
    },
    dimensions: dimensions_
  }];


  Plotly.newPlot(div, data);


}
