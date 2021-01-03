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

  if (dimensions.length !== 3) {
    plot_title.appendChild(info_icon);
  }

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
    case 4:{
      create_fourDim_dropDown(info_icon, plot_title);
      break;
    }


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

function elementIndex(list, element){
  var index = list.indexOf(element);
  if(index == -1){
    index = list.length - 1;
  }
  return index;
}
