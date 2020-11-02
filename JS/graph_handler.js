// Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv', function(err, rows){
// function unpack(rows, key) {
//   return rows.map(function(row) { return row[key]; });
// }
//
// var z_data=[ ]
// for(i=0;i<24;i++)
// {
//   z_data.push(unpack(rows,i));
// }
//
// // console.log(z_data);
//
//
// var data = [{
//            z: z_data,
//            type: 'surface'
//         }];
//
// var layout = {
//   title: 'Mt Bruno Elevation',
//   autosize: false,
//   width: 500,
//   height: 500,
//   margin: {
//     l: 65,
//     r: 50,
//     b: 65,
//     t: 90,
//   }
// };
// Plotly.newPlot('ADAM_D1', data, layout);
// });
//Get the icon that makes appear the types of graphs

let changeGraph = document.getElementsByClassName("info_icon");


changeGraph[0].addEventListener('click',function(){
  let oneDim = document.getElementsByClassName("choose_one_dim")[0];
  // console.log(oneDim);

  if(oneDim.style.visibility == 'hidden'){
    oneDim.style.visibility = 'visible';
    oneDim.style.height = '75px';
    oneDim.style.width = '150px';
    oneDim.style.padding = '.5em';
  }else{
    oneDim.style.visibility = 'hidden';
    oneDim.style.height = '0';
    oneDim.style.width = '0';
    oneDim.style.padding = '0';
  }

  oneDim.addEventListener('click',function(){
    let childs = document.getElementsByName("oneDim");
    for (var i = 0; i<childs.length; i++){
      if(childs[i].checked){
        plotType1 = childs[i].value
      }
    }
    console.log(plotType1);
  });
});


function handle_graphs(plotType){
  var dims= getDimensions();
  //console.log('nr de dimensoes = '+ dims.length);
  let div = create_dimension_div(algorithms_chosen);
  switch (dims.length) {
    case 1:
      for(var i = 0; i < INDEXRECORDER.length; i++){
        console.log(INDEXRECORDER[i]);
      }
      oneDim(dims, algorithms_chosen, plotType, div);
      break;
    case 2:
      let algorithms = getAlgorithms();
      let ratio = algorithms.length;
      let total_chosen = algorithms_chosen.length;
      if(ratio * dims.length == total_chosen){
        twoDimPlot(div, dims, algorithms)
      }else{
        alert('You need to select the same algorithms in both dimensions')
      }
      break;
    case 3:

      break;
    case 4:

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
  return dims;
}

function getAlgorithms(){
  var algs = [];
  for(var i = 0; i < algorithms_chosen.length; i++){
    element = algorithms_chosen[i].split("_");
      algs.push(element[0]);
  }
  var dims = [];
  var filteredArray = algs.filter(function(item, pos){
    if(algs.indexOf(item) == pos){
      dims.push(item);
    }
  });
  return dims;
}

// Finds info needed to plot one dimension graphs, calls function to draw the plot
function oneDim(dim, chosen_algs, plotType, div){
  console.log(dim);
  var index = 0
  switch (dim) {
    case 'acc':
      index = 0;
      break;
    case 'loss':
      index = 1;
      break;
    case 'val_acc':
      index = 2;
      break;
    case 'val_loss':
      index = 3;
      break;
    default:

  }

  //lista correspondentes a cada run para dita dimesao
  let aux = [[], [], [], [], []];

  for(var i = 0; i < chosen_algs.length; i++){
    if(chosen_algs[i].includes('ADAMW')){
      aux[0] = ADAMW[index];
    }
    if(chosen_algs[i].includes('RADAM')){
      aux[1] = RADAM[index];
    }
    if(chosen_algs[i].includes('RMSprop')){
      aux[2] = RMSPROP[index];
    }
    if(chosen_algs[i].includes('SGD')){
      aux[3] = SGD[index];
    }
    else{
      aux[4] = ADAM[index];
    }
  }
  makeOneDimPlot(aux, plotType, div)
}

//creates listener for each dropdown
function createDropListner(icon, dropdown){
  let options = dropdown.childNodes;
  console.log(options + 'options');
  for(let i = 0; i<options.length; i++){
    console.log(options[i].value)
    options[i].addEventListener('click', function(){
      let dim ='';
      let dimName = dropdown.parentNode.getElementsByClassName('dim_title')[0].textContent;
      let algs_chosen = dropdown.parentNode.getElementsByClassName('alg_title')[0].textContent.split(' vs ');
      switch (dimName) {
        case 'Accuracy':
          dim = 'acc';
          break;
        case 'Loss':
          dim = 'loss';
          break;
        case 'Value Accuracy':
          dim = 'val_acc';
          break;
        case 'Value Loss':
          dim = 'val_loss';
          break;
        default:

      }
      let div = dropdown.parentNode.parentNode.getElementsByClassName('graphs_content')[0].getElementsByClassName('graph')[0];

      console.log(div);
      oneDim(dim, algs_chosen ,options[i].value, div);

    });
  }
  icon.addEventListener('click', function(){
    if(dropdown.style.visibility == 'hidden'){
      dropdown.style.visibility = 'visible';
      dropdown.style.height = '75px';
      dropdown.style.width = '150px';
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
  box.setAttribute('class', 'graphOption')
  box.setAttribute('id', 'box');
  box.setAttribute('name', 'oneDim');
  box.value = 'box';
  box.setAttribute('width', '100%');
  box.setAttribute('height', '100%');
  box.textContent = 'Boxplot'
  dropdown.appendChild(box)

  let violin = document.createElement('span')
  violin.setAttribute('class', 'graphOption')
  violin.setAttribute('id', 'violin');
  violin.setAttribute('name', 'oneDim');
  violin.value = 'violin';
  violin.setAttribute('width', '100%');
  violin.setAttribute('height', '100%');
  violin.textContent = 'Violinplot'
  dropdown.appendChild(violin)

  plot_title.appendChild(dropdown)

  console.log('creating');
  createDropListner(icon, dropdown)
}
function create_dimension_div(dimensions){
  //keps track of which algorithms are being ploted
  let algorithms_title = '';

  //keps track of which dimension that's being ploted
  let dimensions_title = ''

  dimensions.forEach((dimension,i) => {

    if (dimension.includes('ADAM') && !dimension.includes('ADAMW') && !dimension.includes('RADAM')) {
      algorithms_title += 'ADAM'
    }
    else if (dimension.includes('ADAMW')) {
      algorithms_title += 'ADAMW'
    }
    else if (dimension.includes('RADAM')) {
      algorithms_title += 'RADAM'
    }
    else if (dimension.includes('RMSprop')) {
      algorithms_title += 'RMSprop'
    }
    else if (dimension.includes('SGD')) {
      algorithms_title += 'SGD'
    }
    if (i != dimensions.length -1) {
      algorithms_title += ' vs '
    }
  });

  let dim_selected = getDimensions();

  dim_selected.forEach((dimension,i) => {
    switch (dimension) {
      case 'acc':{
        dimensions_title += 'Accuracy'
        break;
      }
      case 'loss':{
        dimensions_title += 'Loss'
        break;
      }
      case 'val_acc':{
        dimensions_title += 'Value Accuracy'
        break;
      }
      case 'val_loss':{
        dimensions_title += 'Value Loss'
        break;
      }
      if (i != dim_selected.length -1) {
        dimensions_title += ' vs '
      }

    }
  });

  console.log(algorithms_title);
  console.log(dim_selected);

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
  create_oneDim_dropDown(info_icon, plot_title);
  document.querySelector('.main_content').appendChild(plot_content);

  return graph
}

function create_delete_listener(trash_button){
  trash_button.addEventListener('click',function(){
    let plot_title = trash_button.parentNode.parentNode;
    plot_title.remove();
  });
}

//takes info from algorithms vector and puts it in a single column, also stores the color in a vector with accondingly indexes
function getInfoAlgs(algs){
  var columns = [];
  var colors = [];
  var algNames = [];

  for(var x=0; x < algs.length; x++){
    if(algs[x].length > 0){
    column = [];
    for(var i=0; i < algs[x].length; i++){
      for(var j=0;j < algs[x][i].length; j++){
        column.push(algs[x][i][j]);
      }
    }
    switch (x) {
      case 0:
        colors.push(ADAMWCOLOR);
        algNames.push('ADAMW');
        break;
      case 1:
        colors.push(RADAMCOLOR);
        algNames.push('RADAM');
        break;
      case 2:
        colors.push(RMSPROPCOLOR);
        algNames.push('RMSPROP');
        break;
      case 3:
        colors.push(SGDCOLOR);
        algNames.push('SGD');
        break;
      case 4:
        colors.push(ADAMCOLOR);
        algNames.push('ADAM');
        break;
      default:
    }
    columns.push(column);
    }
  }
  let info = [columns, colors, algNames]
  return info
}


//Draws plot for 1 dimension, algs(list with the algs to be represented), plotType('box' or 'violin'), div to draw the plot
function makeOneDimPlot(algs, plotType, div){
  let info = getInfoAlgs(algs);

  let columns = info[0];
  let colors = info[1];
  let algNames = info[2];

  let data = [];
  let trace ={};


  for (var i = 0; i<columns.length; i++){

    trace = {
      type: plotType,
      y: columns[i],
      name : algNames[i],
      points: 'none',
      box: {
        visible: true
      },
      boxpoints: false,
      line: {
        color: colors[i]
      },
      fillcolor: 'white',
      opacity: 0.6,
      meanline: {
        visible: true
      },
      x0: algNames[i]
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

  div.on('plotly_click', (eventData) => {
    // var marginT = div._fullLayout.margin.t;
    // var y = Y - marginT;
    // console.log(eventData)
    console.log(eventData.event.clientY, div.offsetHeight);

  });
}

function twoDimPlot(div, dims, chosen_algs){
  var indexes = []
  var colors = ['','','','',''];
  var algNames = ['','','','',''];
  var dimensions = ['',''];

  for(let i = 0; i<2; i++){
    switch (dims[i]) {
      case 'acc':
        indexes.push(0);
        dimensions[i] = 'Accuracy'
        break;
      case 'loss':
        indexes.push(1);
        dimensions[i] = 'Loss'
        break;
      case 'val_acc':
        indexes.push(2);
        dimensions[i] = 'Value Accuracy'
        break;
      case 'val_loss':
        indexes.push(3);
        dimensions[i] = 'Value Loss'
        break;
      default:
    }
  }

  console.log(chosen_algs + ' indexes');
  let aux = [[], [], [], [], []];

  for(let j = 0; j<indexes.length; j++){
    //lista correspondente às dimensoes cada algoritmo
    for(let i = 0; i<chosen_algs.length; i++){
      switch (chosen_algs[i]){
        case 'ADAM':
          aux[0].push(ADAM[indexes[j]]);
          colors[0] = ADAMCOLOR
          algNames[0] = 'ADAM';
          break;
        case 'ADAMW':
          aux[1].push(ADAMW[indexes[j]]);
          colors[1] = ADAMWCOLOR
          algNames[1] = 'ADAM';
          break;
        case 'RADAM':
          aux[2].push(RADAM[indexes[j]]);
          colors[2] = RADAMCOLOR
          algNames[2] = 'ADAMW';
          break;
        case 'RMSprop':
          aux[3].push(RMSPROP[indexes[j]]);
          colors[3] = RMSPROPCOLOR
          algNames[3] = 'RMSprop';
          break;
        case 'SGD':
          aux[4].push(SGD[indexes[j]]);
          colors[4] = SGDCOLOR
          algNames[4] = 'SGD';
          break;
        default:
      }
    }
  }

  for(let i = 0; i<aux.length; i++){
    console.log(aux[i]);
    for(let j = 0; j<aux[i].length; j++){
     let dimension = [];
      for(let x = 0; x<aux[i][j].length; x++){
        for(let c = 0; c<aux[i][j][x].length; c++ ){
          dimension.push(aux[i][j][x][c]);
        }
      }
    aux[i][j] = dimension;
   }
  }

var data =[];
console.log(colors);

for(let i = 0; i<aux.length; i++){
  if(aux[i].length > 0){
    console.log();
    var trace = {
    x: aux[i][0],
    y: aux[i][1],
    mode: 'markers',
    type: 'line',
    line: {
      color: colors[i]
    },
    name: algNames[i],
    };
    data.push(trace);
  }
}
layout = {
       hovermode:'closest',
       xaxis:{zeroline:false, title: dimensions[0]},
       yaxis:{zeroline:false, title: dimensions[1]}
    };

Plotly.newPlot(div, data, layout);
}
