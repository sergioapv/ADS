
//Makes a 2 Dimension plot according the chosen plotType
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

//Creates a dropdown to choose between plot types, for 2 dimensions
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

//Creates a listner for the plots the user can choose from, in the dropdown
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

  //When info_icon is clicked the dropdown becomes visible or hidden according to it previous state
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


// Draws an annotation in the point clicked and highlights points that belong to the same file
function display_annotations_listener(div, dims, chosen_algs){
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
          opacityPoints.push(0.1)
          borderColor.push(Algorithms_colors[algIndex])
        }
      }

      var update = {
        marker: {
          opacity: opacityPoints,
          color: borderColor,
          width: 6
        }
      };

      var updateAll = {
      marker:{
        opacity: 0.1
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

      var point = data.points[0],
          newAnnotation = {
            x: point.xaxis.d2l(point.x),
            y: point.yaxis.d2l(point.y),
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
                  '<br><b>File Path</b>  <br>'+(getFilePath(point.data.name, point.pointIndex)[0]) +
                  '<br><b>Line</b>  <br>'+(getFilePath(point.data.name, point.pointIndex)[1])
        },
        newIndex = (div.layout.annotations || []).length;

    if(newIndex) {
       var foundCopy = false;
       div.layout.annotations.forEach(function(ann, sameIndex) {

          if(ann.text === newAnnotation.text ) {
            div.layout.annotations = []
            Plotly.relayout(div, 'annotations[' + sameIndex + ']', 'remove');

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
    })
  }

// Listens to graphs being zoomed in : the hypervolume changes according to the points being visualized
function update_hypervolume_on_relayout(div){
  div.on('plotly_relayout',
    function(eventdata){
      console.log(eventdata);
      let x_start = eventdata['xaxis.range[0]']
      let x_end = eventdata['xaxis.range[1]']
      console.log(x_start + ' ' + x_end);
      let point_list = [[],[]]

      for (var i = 0; i < div.data.length; i++) {
        point_list = [[],[]];

        x_start = (eventdata['xaxis.range[0]'] || Math.min.apply(Math, div.data[i].x))
        x_end = (eventdata['xaxis.range[1]'] || Math.max.apply(Math, div.data[i].x))

        for (var j = 0; j < div.data[i].x.length; j++) {

          let x = div.data[i].x[j];
          let y = div.data[i].y[j];

          if ((x >= x_start) && (x <= x_end)) {
            point_list[0].push(x);
            point_list[1].push(y);
          }
        }
        update_hypervolume_value(div,div.data[i].name,hyperVolume2D(point_list))
      }
  });
}

//Plots a scatter plot for 2 dimensions, given a div, the dimensions and algorithms to be plotted
function twoDimScatterPlot(div, dims, chosen_algs){
  dim_indexes = [Dimensions_names.indexOf(dims[0]), Dimensions_names.indexOf(dims[1])]

  for(var x = 0; x<dim_indexes.length; x++){
    if(dim_indexes[x] == -1){
      dim_indexes[x] = dim_indexes.length - 1
    }
  }

  create_hypervolume_list(div,chosen_algs)

  var data =[];
  for(let i = 0; i<chosen_algs.length; i++){
    let algIndex = Algorithms_names.indexOf(chosen_algs[i]);
    let alg = Algorithms_data[algIndex]
    console.log(hyperVolume2D([alg[dim_indexes[0]], alg[dim_indexes[1]]]));
    var trace = {
      x: alg[dim_indexes[0]],
      y: alg[dim_indexes[1]],
      hovertemplate: '<b>' + chosen_algs[i] + '</b><br>' +
                     '<i>' + dims[0] +'</i>: %{x}'  +
                     '<br><i>' + dims[1] + '</i>: %{y} <br>',
      mode: 'markers',
      type: 'line',
      line: {
        color: Algorithms_colors[algIndex]
      },
      name: chosen_algs[i],
      };
    data.push(trace);
    update_hypervolume_value(div,chosen_algs[i],hyperVolume2D([alg[dim_indexes[0]], alg[dim_indexes[1]]]));
  }

  layout = {
     hovermode:'closest',
     xaxis:{zeroline:false, title: {text: dims[0]}},
     yaxis:{zeroline:false, title: {text: dims[1]}}
  };

  Plotly.newPlot(div, data, layout);

  //checks if there has been a relayout
  update_hypervolume_on_relayout(div)

// Checks if points have been clicked
  display_annotations_listener(div, dims, chosen_algs);
}


//Plots a density plot for 2 dimensions, given a div, the dimensions and algorithms to be plotted
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
