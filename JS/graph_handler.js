function handle_graphs(plotType){
  console.log(INDEXRECORDER);
  var dims= getDimensions();
  let chosen_algs_names = getAlgorithms();
  let div = {};
  let nr_algs = chosen_algs_names.length;
  let total_chosen = algorithms_chosen.length;
  switch (dims.length) {
    case 1:
      div = create_dimension_div(dims, chosen_algs_names);
      makeOneDimPlot(dims[0], chosen_algs_names, plotType, div);
      break;
    case 2:
      div = create_dimension_div(dims, chosen_algs_names);
      if(nr_algs == 1){
        	twoDimDensityPlot(div, dims, chosen_algs_names);
      }else{
        if(nr_algs * dims.length == total_chosen){
          twoDimScatterPlot(div, dims, chosen_algs_names);
        }else{
          alert('You need to select the same algorithms in both dimensions')
        }
      }
      break;
    case 3:
      div = create_dimension_div(dims, chosen_algs_names);
      if(nr_algs * dims.length == total_chosen){
        threeDimScatterPlot(div, dims, chosen_algs_names);
      }else{
        alert('You need to select the same algorithms in the three dimensions')
      }

      break;
    case 4:
      div = create_dimension_div(dims, chosen_algs_names);
      if(nr_algs * dims.length == total_chosen){
        fourDimScatterPlot(div, dims, chosen_algs_names);
      }else{
        alert('You need to select the same algorithms in the three dimensions')
      }

      break;
    default: alert("Select some algorithms");

  }
}

function getDimensions(){
  var dimension_types = [];
  for(var i = 0; i < algorithms_chosen.length; i++){
    element = algorithms_chosen[i].split("_");
    if(element.length ==2 ){
      dimension_types.push(element[1]);
    }else{
      var dim = element[1] + '_' + element[2];
      dimension_types.push(dim);
    }
  }
  var dims = [];
  var filteredArray = dimension_types.filter(function(item, pos){
    if(dimension_types.indexOf(item) == pos){
      dims.push(item);
    }
  });
  console.log(dims);
  return dims;
}

function getAlgorithms(){
  var algs = [];
  for(var i = 0; i < algorithms_chosen.length; i++){
    element = algorithms_chosen[i].split("_");
      algs.push(element[0]);
  }
  var algorithms = [];
  var filteredArray = algs.filter(function(item, pos){
    if(algs.indexOf(item) == pos){
      algorithms.push(item);
    }
  });

  console.log(algorithms);
  return algorithms;
}

//creates listener for each dropdown
function createDropListner(icon, dropdown){
  let options = dropdown.childNodes;
  console.log(options);
  for(let i = 0; i<options.length; i++){
    console.log(options[i].value)
    options[i].addEventListener('click', function(){
      let dim ='';
      let dimName = dropdown.parentNode.getElementsByClassName('dim_title')[0].textContent;
      let algs_chosen = dropdown.parentNode.getElementsByClassName('alg_title')[0].textContent.split(' vs ');
      let div = dropdown.parentNode.parentNode.getElementsByClassName('graphs_content')[0].getElementsByClassName('graph')[0];
      console.log(dimName + algs_chosen);
      console.log(div);
      makeOneDimPlot(dimName, algs_chosen, options[i].value, div)
    });
  }
  icon.addEventListener('click', function(){
    if(dropdown.style.visibility == 'hidden'){
      dropdown.style.visibility = 'visible';
      dropdown.style.height = '100px';
      dropdown.style.width = '210px';
      dropdown.style.padding = '.5em';
    }else{
      dropdown.style.visibility = 'hidden';
      dropdown.style.height = '0';
      dropdown.style.width = '0';
      dropdown.style.padding = '0';
    }
  });
}

//Creates dropdown menu to choose graph for one dimension
function create_oneDim_dropDown(icon, plot_title){
  let dropdown = document.createElement('div');
  dropdown.setAttribute('class', 'choose_one_dim');
  dropdown.setAttribute('style', 'visibility: hidden');

  let box = document.createElement('span');
  box.setAttribute('class', 'graphOption');
  box.setAttribute('id', 'box');
  box.setAttribute('name', 'oneDim');
  box.value = 'box';
  // box.setAttribute('width', '100%');
  // box.setAttribute('height', '100%');
  box.textContent = 'Boxplot';
  dropdown.appendChild(box);
  console.log(box);

  let progressive = document.createElement('span');
  progressive.setAttribute('class', 'graphOption');
  progressive.setAttribute('id', 'progressive');
  progressive.setAttribute('name', 'oneDim');
  progressive.value = 'progressive';
  // progressive.setAttribute('width', '100%');
  // progressive.setAttribute('height', '100%');
  progressive.textContent = 'Progressive Graph';
  dropdown.appendChild(progressive);

  let violin = document.createElement('span')
  violin.setAttribute('class', 'graphOption')
  violin.setAttribute('id', 'violin');
  violin.setAttribute('name', 'oneDim');
  violin.value = 'violin';
  // violin.setAttribute('width', '100%');
  // violin.setAttribute('height', '100%');
  violin.textContent = 'Violinplot'
  dropdown.appendChild(violin)

  plot_title.appendChild(dropdown)

  console.log('creating');
  createDropListner(icon, dropdown)
}
function create_dimension_div(dimensions, algorithms){
  //keps track of which algorithms are being ploted
  let algorithms_title = '';

  //keps track of which dimension that's being ploted
  let dimensions_title = ''

  for(var i = 0; i < dimensions.length; i ++){
    if(i === dimensions.length - 1){
      dimensions_title += dimensions[i];
    }else{
      dimensions_title += dimensions[i] + ' vs ';
    }
  }

  for(var i = 0; i < algorithms.length; i ++){
    if(i === algorithms.length - 1){
      algorithms_title += algorithms[i];
    }else{
      algorithms_title += algorithms[i] + ' vs ';
    }
  }

  let plot_content = document.createElement('div');
  plot_content.className = 'Plot_content';

  let plot_title = document.createElement('div');
  plot_title.className = 'Plot_title';

  let dim_title = document.createElement('span');
  dim_title.className = 'dim_title'
  dim_title.innerHTML = dimensions_title;

  let line = document.createElement('hr');
  line.style = 'width:40%;margin:0 auto;';

  let alg_title = document.createElement('span');
  alg_title.className = 'alg_title';
  alg_title.innerHTML = algorithms_title;

  let trash_icon = document.createElement('img');
  trash_icon.className = 'trash_icon';
  trash_icon.src = './images/trash_icon.png';

  let info_icon = document.createElement('img');
  info_icon.className = 'info_icon';
  info_icon.src = './images/exchange.png';

  let graphs_content = document.createElement('div');
  graphs_content.className = 'graphs_content';

  let graph = document.createElement('div');
  graph.className = 'graph';

  graphs_content.appendChild(graph);

  create_delete_listener(trash_icon);

  plot_title.appendChild(dim_title);
  plot_title.appendChild(line);
  plot_title.appendChild(alg_title);
  plot_title.appendChild(trash_icon);
  plot_title.appendChild(info_icon);

  plot_content.appendChild(plot_title);

  plot_content.appendChild(graphs_content);
  //Only call function when there is one dimension
  if(dimensions.length == 1){
    create_oneDim_dropDown(info_icon, plot_title);
  }
  document.querySelector('.main_content').appendChild(plot_content);

  return graph
}

function create_delete_listener(trash_button){
  trash_button.addEventListener('click',function(){
    let plot_title = trash_button.parentNode.parentNode;
    plot_title.remove();
  });
}


//Draws plot for 1 dimension, algs(list with the algs to be represented), plotType('box' or 'violin'), div to draw the plot
function makeOneDimPlot(dim, chosen_algs_names, plotType, div){
  let data = [];
  let trace ={};

  console.log(dim);
  console.log(chosen_algs_names);

  let dimensionIndex = elementIndex(Dimensions_names, dim);

  console.log('Dimension index = ' + dimensionIndex);
  if(plotType != "progressive"){
    for (var i = 0; i<chosen_algs_names.length; i++){
      let algorithm_index = elementIndex(Algorithms_names, chosen_algs_names[i]);
      console.log('Algorithm index = ' + dimensionIndex);
      trace = {
        type: plotType,
        y: Algorithms_data[algorithm_index][dimensionIndex],
        name : chosen_algs_names[i],
        points: 'none',
        box: {
          visible: true
        },
        boxpoints: false,
        line: {
          color: Algorithms_colors[algorithm_index]
        },
        fillcolor: 'white',
        opacity: 0.6,
        meanline: {
          visible: true
        },
        x0: chosen_algs_names[i]
      }

      data.push(trace);

    }

    var layout = {
      title: "",
      yaxis: {
        zeroline: false
      },
      hovermode:'closest'
    }

    Plotly.newPlot(div, data, layout);

  }else{
    let data = [];
    for (var i = 0; i<chosen_algs_names.length; i++){
      let algorithm_index = elementIndex(Algorithms_names, chosen_algs_names[i]);
      let alg_data = Algorithms_data[algorithm_index][dimensionIndex];
      let range = Array.from(Array(alg_data.length).keys())

      var trace1 = {
      x: range,
      y: alg_data,
      type: 'scatter',
      line: {
        color: Algorithms_colors[algorithm_index]
      },
      name: chosen_algs_names[i],
      transition: {
        duration: 500,
        easing: 'cubic-in-out'
      },
      frame: {
        duration: 500
        }
      };

      data.push(trace1);

      }

      var layout = {
         yaxis:{zeroline:false, title: {text: dim}},
         xaxis:{zeroline:false, title: {text: 'x'}}
      };

      Plotly.newPlot(div, data, layout)
    }
  }

function twoDimScatterPlot(div, dims, chosen_algs){
  dim_indexes = [Dimensions_names.indexOf(dims[0]), Dimensions_names.indexOf(dims[1])]
  for(var x = 0; x<dim_indexes.length; x++){
    if(dim_indexes[x] == -1){
      dim_indexes[x] = dim_indexes.length - 1
    }
  }
  var data =[];
  for(let i = 0; i<chosen_algs.length; i++){
      algIndex = Algorithms_names.indexOf(chosen_algs[i]);
      alg = Algorithms_data[algIndex]
      var trace = {
      x: alg[dim_indexes[0]],
      y: alg[dim_indexes[1]],
      mode: 'markers',
      type: 'line',
      line: {
        color: Algorithms_colors[algIndex]
      },
      name: chosen_algs[i],
      };
      data.push(trace);
      }

      layout = {
         hovermode:'closest',
         xaxis:{zeroline:false, title: {text: dims[0]}},
         yaxis:{zeroline:false, title: {text: dims[1]}}
      };

  Plotly.newPlot(div, data, layout);
}

function twoDimDensityPlot(div, dims, chosen_algs){
  algIndex1 = Algorithms_names.indexOf(chosen_algs[0]);
  dim_index1 = Dimensions_names.indexOf(dims[0])
  dim_index2 = Dimensions_names.indexOf(dims[1])
  alg1 = Algorithms_data[algIndex1]

  var trace1 = {
    x: alg1[dim_index1],
    y: alg1[dim_index2],
    name: 'density',
    ncontours: 20,
    colorscale: 'Hot',
    reversescale: true,
    showscale: false,
    type: 'histogram2dcontour'
  };
  var trace2 = {
    x: alg1[dim_index1],
    name: 'x density',
    marker: {color: 'rgb(102,0,0)'},
    yaxis: 'y2',
    type: 'histogram'
  };
  var trace3 = {
    y: alg1[dim_index2],
    name: 'y density',
    marker: {color: 'rgb(102,0,0)'},
    xaxis: 'x2',
    type: 'histogram'
  };
  var data = [trace1, trace2, trace3];
  var layout = {
    showlegend: false,
    autosize: true,
    margin: {t: 50},
    hovermode: 'closest',
    bargap: 0,
    xaxis: {
      domain: [0, 0.85],
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      domain: [0, 0.85],
      showgrid: false,
      zeroline: false
    },
    xaxis2: {
      domain: [0.85, 1],
      showgrid: false,
      zeroline: false
    },
    yaxis2: {
      domain: [0.85, 1],
      showgrid: false,
      zeroline: false
    }
  };
  Plotly.newPlot(div, data, layout);
}

function threeDimScatterPlot(div, dims, chosen_algs){
  let data = [];
  dims = Array.from(dims);
  dim1 = elementIndex(Dimensions_names, dims[0]);
  dim2 = elementIndex(Dimensions_names, dims[1]);
  dim3 = elementIndex(Dimensions_names, dims[2]);
  for(var i = 0; i < chosen_algs.length; i++){
    algIndex = elementIndex(Algorithms_names, chosen_algs[i]);
    var trace1 = {
  	x:Algorithms_data[algIndex][dim1], y: Algorithms_data[algIndex][dim2], z: Algorithms_data[algIndex][dim3],
  	mode: 'markers',
    line: {
      color: Algorithms_colors[algIndex]
    },
  	marker: {
  		size: 3,
  		line: {
  		color: Algorithms_colors[algIndex],
  		width: 0.5},
  		opacity: 0.8},
  	type: 'scatter3d'
    };
    data.push(trace1);
  }

  var layout = {margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0
  },
  xaxis : {
    title : { text :dims[0]}
  },
  yaxis : {
    title : { text : dims[1]}
  },
  zaxis : {
    title : { text : dims[2]}
  }};
  Plotly.newPlot(div, data, layout);
}

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

function colorRange(color, dim){
  let colorRangeList = [];
  var color = hexToRgb(color).split('(')[1].split(')')[0].split(',')
  for(var i = 0; i<3; i++){
    color[i] = parseInt(color[i])
  }
  let maxV = Math.max.apply(Math,color); // 3
  let minV = Math.min.apply(Math,color);
  color[elementIndex(color, maxV)] = 255;
  color[elementIndex(color, minV)] = 0;
  console.log(color);
  let dimMin = Math.min.apply(Math,dim);
  let dimMax = Math.max.apply(Math,dim);
  for(let i = 0; i < dim.length; i++){
    colorRangeList.push('rgb(' + color[0]*((dim[i] - dimMin)/(dimMax-dimMin)) + ',' + color[1]*((dim[i] - dimMin)/(dimMax-dimMin)) + ',' + color[2]*((dim[i] - dimMin)/(dimMax-dimMin))+ ')')
  }
  return colorRangeList
}


function fourDimScatterPlot(div, dims, chosen_algs){
  let data = [];
  dims = Array.from(dims);
  dim1 = elementIndex(Dimensions_names, dims[0]);
  dim2 = elementIndex(Dimensions_names, dims[1]);
  dim3 = elementIndex(Dimensions_names, dims[2]);
  dim4 = elementIndex(Dimensions_names, dims[3]);
  for(var i = 0; i < chosen_algs.length; i++){
    algIndex = elementIndex(Algorithms_names, chosen_algs[i]);
    let colorList = colorRange(Algorithms_colors[algIndex], Algorithms_data[algIndex][dim4])
    var trace1 = {
    mode: 'markers',
    type: 'scatter3d',
    x:Algorithms_data[algIndex][dim1], y: Algorithms_data[algIndex][dim2], z: Algorithms_data[algIndex][dim3],
    	marker: {
    		size: 3,
        color: colorList,
        colorbar: {
        }
      },
    };
    data.push(trace1);
  }

  var layout = {margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0
  },
  xaxis : {
    title : { text :dims[0]}
  },
  yaxis : {
    title : { text : dims[1]}
  },
  zaxis : {
    title : { text : dims[2]}
  }};
  Plotly.newPlot(div, data, layout);
}

  function elementIndex(list, element){
    var index = list.indexOf(element);
    if(index == -1){
      index = list.length - 1;
    }
    return index;
  }
