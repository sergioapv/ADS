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
      makeTwoDimPlot(div , dims , chosen_algs_names, plotType)
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
        plot4dim(div, dims, chosen_algs_names, plotType)
      }else{
        alert('You need to select the same algorithms in the four dimensions')
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
function createOneDimDropListner(icon, dropdown){
  let options = dropdown.childNodes;
  for(let i = 0; i<options.length; i++){
    console.log(options[i].value)
    options[i].addEventListener('click', function(){
      let dim ='';
      let dimName = dropdown.parentNode.getElementsByClassName('dim_title')[0].textContent;
      let algs_chosen = dropdown.parentNode.getElementsByClassName('alg_title')[0].textContent.split(' vs ');
      let div = dropdown.parentNode.parentNode.getElementsByClassName('graphs_content')[0].getElementsByClassName('graph')[0];
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
  dropdown.setAttribute('style', 'visibility: hidden; z-index:99');

  let box = document.createElement('span');
  box.setAttribute('class', 'graphOption');
  box.setAttribute('id', 'box');
  box.setAttribute('name', 'oneDim');
  box.value = 'box';

  box.textContent = 'Boxplot';
  dropdown.appendChild(box);

  let progressive = document.createElement('span');
  progressive.setAttribute('class', 'graphOption');
  progressive.setAttribute('id', 'progressive');
  progressive.setAttribute('name', 'oneDim');
  progressive.value = 'progressive';

  progressive.textContent = 'Progressive Graph';
  dropdown.appendChild(progressive);

  let violin = document.createElement('span')
  violin.setAttribute('class', 'graphOption')
  violin.setAttribute('id', 'violin');
  violin.setAttribute('name', 'oneDim');
  violin.value = 'violin';

  violin.textContent = 'Violinplot'
  dropdown.appendChild(violin)

  plot_title.appendChild(dropdown)

  createOneDimDropListner(icon, dropdown)
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
  switch (dimensions.length) {
    case 1:{
      create_oneDim_dropDown(info_icon, plot_title);
      break;
    }
    case 2:{
      create_twoDim_dropDown(info_icon, plot_title);
      break;
    }
    case 3:{
      create_threeDim_dropDown(info_icon, plot_title);
      break;
    }
    case 4:{
      create_fourDim_dropDown(info_icon, plot_title);
      break;
    }


  }

  document.querySelector('.main_content').appendChild(plot_content);

  return graph
}

function append_plots(div){
  let parent = div.parentNode;

  var graph = document.createElement('div');
  graph.classList.add('graph')

  parent.appendChild(graph);

  return graph;
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


  let dimensionIndex = elementIndex(Dimensions_names, dim);

  if(plotType != "progressive"){
    for (var i = 0; i<chosen_algs_names.length; i++){
      let algorithm_index = elementIndex(Algorithms_names, chosen_algs_names[i]);
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
        pointpos: 1.5,
        points: "all",
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
    div.on('plotly_click',
      function(data){
        console.log(data);
        let file = getFilePath(data.points[0].data.name, data.points[0].pointIndex)[0]
        let algIndex = elementIndex(Algorithms_names, data.points[0].data.name)
        let sum = 0
        let interval = [];
        let opacityPoints = [];
        let borderColor = [];
        let size = [];
        for (var i = 0; i < INDEXRECORDER[algIndex].length; i++) {
          sum += INDEXRECORDER[algIndex][i][0]
          if(file.includes(INDEXRECORDER[algIndex][i][1])){
            interval.push(sum - INDEXRECORDER[algIndex][i][0])
            interval.push(sum)
            break;
          }
        }

        let y = []
        for (var i = 0; i < Algorithms_data[algIndex][0].length; i++) {
          if (i >= interval[0] && i <= interval[1]){
            opacityPoints.push(1)
            borderColor.push('red')
            size.push(10)
          }else{
            opacityPoints.push(0.05)
            borderColor.push(Algorithms_colors[algIndex])
            size.push(1)
          }
        }

        var point = data.points[0],
            newAnnotation = {
              y: point.y,
              x: point.x,
              arrowhead: 6,
              ax: -10,
              ay: -90,
              bgcolor: 'rgba(255, 255, 255, 1)',
              arrowcolor: point.fullData.marker.color,
              font: {size:12},
              bordercolor: point.fullData.marker.color,
              borderwidth: 3,
              borderpad: 4,
              text:
                    '<b>Point Atributes</b><br><br>' +
                    '<b>' + dim + '</b><br>'+(point.y) +
                    '<br><b>File Path</b>  <br>'+(getFilePath(point.data.name, point.pointIndex)[0]) +
                    '<br><b>Line</b>  <br>'+(getFilePath(point.data.name, point.pointIndex)[1])
          },
          newIndex = (div.layout.annotations || []).length;
      if(data.points.length > 1){
        for (var i = 0; i < div.layout.annotations.length; i++) {
          div.layout.annotations = []
          Plotly.relayout(div, 'annotations[' + i + ']', 'remove');
        }
        return
      }
      if(newIndex) {
         var foundCopy = false;
         div.layout.annotations.forEach(function(ann, sameIndex) {
            if(ann.text === newAnnotation.text ) {
              div.layout.annotations = []
              Plotly.relayout(div, 'annotations[' + sameIndex + ']', 'remove');
              foundCopy = true;
          }
         });
         if(foundCopy){
           return;
         }
       }
       div.layout.annotations = []
       div.layout.annotations.push(newAnnotation)
       Plotly.relayout(div, 'annotations[' + newIndex + ']', newAnnotation);
    })
  }


function makeTwoDimPlot(div , dims , chosen_algs, plotType){
  switch (plotType) {
    case 'scatter2d':
      twoDimScatterPlot(div, dims, chosen_algs)
      break;
    case 'density':
      create_matrix_density(div, dims, chosen_algs)
      break;

  }
}

function create_twoDim_dropDown(info_icon, plot_title){
  let dropdown = document.createElement('div');
  dropdown.setAttribute('class', 'choose_two_dim');
  dropdown.setAttribute('style', 'visibility: hidden; z-index:99');

  let scatter2d = document.createElement('span');
  scatter2d.setAttribute('class', 'graphOption');
  scatter2d.setAttribute('id', 'scatter2d');
  scatter2d.setAttribute('name', 'twoDim');
  scatter2d.value = 'scatter2d';

  scatter2d.textContent = 'Scatter Plot 2D';
  dropdown.appendChild(scatter2d);

  let density_matrix = document.createElement('span');
  density_matrix.setAttribute('class', 'graphOption');
  density_matrix.setAttribute('id', 'density');
  density_matrix.setAttribute('name', 'twoDim');
  density_matrix.value = 'density';

  density_matrix.textContent = '2D Density';
  dropdown.appendChild(density_matrix);

  plot_title.appendChild(dropdown)

  createTwoDimDropListner(info_icon, dropdown)
}

function createTwoDimDropListner(info_icon, dropdown){
  console.clear();
  let options = dropdown.childNodes;
  for(let i = 0; i<options.length; i++){
    options[i].addEventListener('click', function(){
      let dim ='';
      let dimNames = dropdown.parentNode.getElementsByClassName('dim_title')[0].textContent.split(' vs ');
      let algs_chosen = dropdown.parentNode.getElementsByClassName('alg_title')[0].textContent.split(' vs ');
      let div = (dropdown.parentNode.parentNode.getElementsByClassName('graphs_content')[0].getElementsByClassName('graph')[0] || dropdown.parentNode.parentNode.getElementsByClassName('graphs_content')[0].getElementsByClassName('density_matrix')[0]);

      let plot_content = div.parentNode.parentNode;

      let graphs_content = div.parentNode;
      graphs_content.remove();

      let new_graphs_content = document.createElement('div');
      new_graphs_content.classList.add('graphs_content');

      let new_graph = document.createElement('div');
      new_graph.className = 'graph';

      plot_content.appendChild(new_graphs_content)
      new_graphs_content.appendChild(new_graph);

      makeTwoDimPlot(new_graph, dimNames, algs_chosen, options[i].value)
    });
  }
  info_icon.addEventListener('click', function(){
    if(dropdown.style.visibility == 'hidden'){
      dropdown.style.visibility = 'visible';
      dropdown.style.height = '70px';
      dropdown.style.width = '180px';
      dropdown.style.padding = '.5em';
    }else{
      dropdown.style.visibility = 'hidden';
      dropdown.style.height = '0';
      dropdown.style.width = '0';
      dropdown.style.padding = '0';
    }
  });
}

function getFilePath(algName, pointIndex){
  let algIndex = elementIndex(Algorithms_names, algName);
  let folderName = document.getElementsByClassName('Algorithm_getter')[algIndex].getElementsByTagName('input')[0].placeholder
  let fileSizeList = INDEXRECORDER[algIndex];
  let sum = 0;
  let fileIndex = 0;
  let line = 0;

  for (var i = 0; i < fileSizeList.length ; i++) {
    sum += fileSizeList[i][0];
    if (sum > pointIndex ) {
      fileIndex = i
      break;
    }
  }
  if(fileIndex == 0){
    line = pointIndex;
  }else{

    // 1+1 equals two and that's why I chose you
    line = INDEXRECORDER[algIndex][fileIndex][0] - (sum - pointIndex) + 2
  }
  let fileName = folderName + '/' + INDEXRECORDER[algIndex][fileIndex][1]


  return [fileName, line]
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
    let algIndex = Algorithms_names.indexOf(chosen_algs[i]);
    let alg = Algorithms_data[algIndex]
    console.log(hyperVolume2D([alg[dim_indexes[0]], alg[dim_indexes[1]]]));
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

  div.on('plotly_relayout',
    function(eventdata){
      console.log(eventdata);
      let x_start = eventdata['xaxis.range[0]']
      let x_end = eventdata['xaxis.range[1]']
      console.log(x_start + ' ' + x_end);
      let point_list = [[],[]]
      // console.log(div.data);
      for (var i = 0; i < div.data.length; i++) {
        // console.log(div.data[i].x);
        point_list = [[],[]];

        x_start = (eventdata['xaxis.range[0]'] || Math.min.apply(Math, div.data[i].x))
        x_end = (eventdata['xaxis.range[1]'] || Math.max.apply(Math, div.data[i].x))

        // console.log(div.data[i].x);
        // console.log(Math.max.apply(Math, div.data[i].x));

        for (var j = 0; j < div.data[i].x.length; j++) {

          let x = div.data[i].x[j];
          let y = div.data[i].y[j];

          if ((x >= x_start) && (x <= x_end)) {

            point_list[0].push(x);
            point_list[1].push(y);
          }

        }
        // console.log(point_list);
        console.log(hyperVolume2D(point_list));
      }

  });

  div.on('plotly_click',
    function(data){
      console.log(div.data);
      let file = getFilePath(data.points[0].data.name, data.points[0].pointIndex)[0]
      let algIndex = elementIndex(Algorithms_names, data.points[0].data.name)
      let sum = 0
      let interval = [];
      let opacityPoints = [];
      let borderColor = [];
      for (var i = 0; i < INDEXRECORDER[algIndex].length; i++) {
        sum += INDEXRECORDER[algIndex][i][0]
        if(file.includes(INDEXRECORDER[algIndex][i][1])){
          interval.push(sum - INDEXRECORDER[algIndex][i][0])
          interval.push(sum)
          break;
        }
      }

      let x = []
      let y = []
      for (var i = 0; i < Algorithms_data[algIndex][0].length; i++) {
        if (i >= interval[0] && i <= interval[1]){
          opacityPoints.push(1)
          borderColor.push('red')
        }else{
          opacityPoints.push(0.05)
          borderColor.push(Algorithms_colors[algIndex])
        }
      }

      var update = {
        marker: {
          opacity: opacityPoints,
          line: {
            color: borderColor,
            width: 6
          }
        }
      };

      var updateAll = {
      marker:{
        opacity: 0.05
      }
      };

      var updateResetAll = {
        marker: {
          opacity: 1,
          line: {
            width: 0
          }
        }
      };

      // let newData = div.data.splice(0,1)
      var point = data.points[0],
          newAnnotation = {
            x: point.xaxis.d2l(point.x),
            y: point.yaxis.d2l(point.y),
            arrowhead: 6,
            ax: 0,
            ay: -120,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            arrowcolor: point.fullData.marker.color,
            font: {size:12},
            bordercolor: point.fullData.marker.color,
            borderwidth: 3,
            borderpad: 4,
            text:
                  '<b>Point Atributes</b><br><br>' +
                  '<b>' + dims[0] + '</b><br>'+(point.x) +
                  '<br><b>' + dims[1] + '</b><br>'+(point.y) +
                  '<br><b>File Path</b>  <br>'+(getFilePath(point.data.name, point.pointIndex)[0]) +
                  '<br><b>Line</b>  <br>'+(getFilePath(point.data.name, point.pointIndex)[1])
        },
        newIndex = (div.layout.annotations || []).length;
    //div.layout.annotations = []
     // delete instead if clicked twice
    if(newIndex) {
       var foundCopy = false;
       div.layout.annotations.forEach(function(ann, sameIndex) {
         //Plotly.relayout(div, 'annotations[' + sameIndex + ']', 'remove');
          if(ann.text === newAnnotation.text ) {
            div.layout.annotations = []
            Plotly.relayout(div, 'annotations[' + sameIndex + ']', 'remove');
         //   Plotly.restyle(div, updateResetAll);
         //
              foundCopy = true;
        }
       });
       Plotly.restyle(div, updateResetAll);
       if(foundCopy){
         Plotly.restyle(div, updateResetAll);
         return;
       }
     }
     div.layout.annotations = []
     div.layout.annotations.push(newAnnotation)
     Plotly.relayout(div, 'annotations[' + newIndex + ']', newAnnotation);
     Plotly.restyle(div, updateAll);
     Plotly.restyle(div, update, elementIndex(chosen_algs, point.data.name));
     // div.layout.annotations = [];
  })




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
  var data = [trace1];
  var layout = {
    showlegend: false,
    autosize: true,
    margin: {t: 0},
    hovermode: 'closest',
    bargap: 0,
    xaxis: {
      title: dims[0],
      domain: [0, 0.85],
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      title: dims[1],
      domain: [0, 0.85],
      showgrid: false,
      zeroline: false
    },
  };
  Plotly.newPlot(div, data, layout);
}

function create_threeDim_dropDown(info_icon, plot_title){

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
    name: chosen_algs[i],
  	x:Algorithms_data[algIndex][dim1], y: Algorithms_data[algIndex][dim2], z: Algorithms_data[algIndex][dim3],
  	mode: 'markers',
  	marker: {
      color: Algorithms_colors[algIndex],
  		size: 3,
      text: [Algorithms_names[dim1],Algorithms_names[dim2],Algorithms_names[dim3]],
  		},
  	type: 'scatter3d'
    }
    showlegend:true;

    data.push(trace1);
  }

  var layout = {

    scene: {
  		xaxis:{title: dims[0]},

  		yaxis:{title: dims[1]},

  		zaxis:{title: dims[2]}
    },
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
    },
    showlegend:true,

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
        for (var i = 0; i < Algorithms_data[algIndex][0].length; i++) {
          if (i >= interval[0] && i <= interval[1]){
            opacityPoints.push(1)
            borderColor.push('#ff0000')
          }else{
            opacityPoints.push(0.05)
            borderColor.push(Algorithms_colors[algIndex])

          }
        }

        var point = data.points[0],
            newAnnotation = {
              x: point.x,
              y: point.y,
              z: point.z,
              arrowhead: 6,
              ax: 0,
              ay: -120,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              arrowcolor: Algorithms_colors[algIndex],
              font: {size:12},
              bordercolor: Algorithms_colors[algIndex],
              borderwidth: 3,
              borderpad: 4,
              text:
                    '<b>Point Atributes</b><br><br>' +
                    '<b>' + dims[0] + '</b><br>'+(point.x) +
                    '<br><b>' + dims[1] + '</b><br>'+(point.y) +
                    '<br><b>' + dims[2] + '</b><br>'+(point.z) +
                    '<br><b>File Path</b>  <br>'+(getFilePath(point.data.name, point.pointNumber)[0]) +
                    '<br><b>Line</b>  <br>'+(getFilePath(point.data.name, point.pointNumber)[1])
          },
          newIndex = (div.layout.scene.annotations || []).length;
       // delete instead if clicked twice
      console.log(newIndex);
      if(newIndex > 0) {
         var foundCopy = false;
         div.layout.scene.annotations.forEach(function(ann, sameIndex) {
           if(ann.text === newAnnotation.text ) {
             Plotly.restyle(div,  {"marker.color": Algorithms_colors[algIndex]}, elementIndex(chosen_algs, point.data.name) )
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
         console.log('painting ');
         let index = elementIndex(Algorithms_names, div.data[i1].name)
         Plotly.restyle(div,  {"marker.color": Algorithms_colors[index]}, i1)
       }
       Plotly.restyle(div,  {"marker.color": [borderColor]}, elementIndex(chosen_algs, point.data.name) )


    })
  });


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

    	marker: {
      	size: 3,
        color: value_color_range,
      },

    };
    data.push(trace1);
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
             console.log('painting ');
             Plotly.restyle(div,  {"marker.color": [color]}, i1)
           }
           Plotly.restyle(div,  {"marker.color": [borderColor]}, elementIndex(chosen_algs, point.data.name) )


          })
          });

}

function elementIndex(list, element){
  var index = list.indexOf(element);
  if(index == -1){
    index = list.length - 1;
  }
  return index;
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
