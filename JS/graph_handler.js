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
  let div = create_dimension_div(algorithms_chosen);
  let chosen_algs_names = getAlgorithms();

  switch (dims.length) {
    case 1:
      makeOneDimPlot(dims, chosen_algs_names, plotType, div);
      break;
    case 2:
      let algorithms = getAlgorithms();
      let ratio = algorithms.length;
      let total_chosen = algorithms_chosen.length;
      if(ratio * dims.length == total_chosen){
        twoDimPlot(div, dims, chosen_algs_names);
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
      if ((!algorithms_title.includes('ADAM ')) && (algorithms_title === '')) {
        algorithms_title += 'ADAM';
      }
      else {
        algorithms_title += ' vs ADAM';
      }
        added = true;
    }

    else if (dimension.includes('ADAMW')) {
      if ((!algorithms_title.includes('ADAMW')) && (algorithms_title === '')) {
        algorithms_title += 'ADAMW';
      }
      else {
        algorithms_title += ' vs ADAMW';
      }
    }

    else if (dimension.includes('RADAM')) {
      if ((!algorithms_title.includes('RADAM')) && (algorithms_title === '')) {
        algorithms_title += 'RADAM';
      }
      else {
        algorithms_title += ' vs RADAM';
      }
    }

    else if (dimension.includes('RMSprop')) {
      if ((!algorithms_title.includes('RMSprop')) && (algorithms_title === '')) {
        algorithms_title += 'RMSprop';
      }
      else {
        algorithms_title += ' vs RMSprop';
      }
    }

    else if (dimension.includes('SGD')) {
      if ((!algorithms_title.includes('SGD')) && (algorithms_title === '')) {
        algorithms_title += 'SGD';
      }
      else {
        algorithms_title += ' vs SGD';
      }
    }
  });

  let dim_selected = getDimensions();

  dim_selected.forEach((dimension,i) => {
    switch (dimension) {
      case 'acc':{
        if (!dimensions_title.includes('Accuracy')) {
          dimensions_title += 'Accuracy'
        }
        break;
      }
      case 'loss':{
        if (!dimensions_title.includes('Loss')) {
          dimensions_title += 'Loss'
        }
        break;
      }
      case 'val_acc':{
        if (!dimensions_title.includes( 'Value Accuracy')) {
          dimensions_title +=  'Value Accuracy'
        }
        break;
      }
      case 'val_loss':{
        if (!dimensions_title.includes('Value Loss')) {
          dimensions_title +=  'Value Loss'
        }
        break;
      }
      if (i != dim_selected.length -1) {
        dimensions_title += ' vs '
      }

    }
  });

  console.log(algorithms_title);
  console.log(dim_selected);
  console.log(dimensions_title);

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


//Draws plot for 1 dimension, algs(list with the algs to be represented), plotType('box' or 'violin'), div to draw the plot
function makeOneDimPlot(dim, chosen_algs_names, plotType, div){
  let data = [];
  let trace ={};

  console.log(Dimensions_names);
  console.log(Algorithms_names);

  let dimensionIndex = Dimensions_names.indexOf(dim[0])
  console.log('Dimension index = ' + dimensionIndex);
  for (var i = 0; i<chosen_algs_names.length; i++){
    let algorithm_index = Algorithms_names.indexOf(chosen_algs_names[i]);
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

  div.on('plotly_click', (eventData) => {
    // var marginT = div._fullLayout.margin.t;
    // var y = Y - marginT;
    // console.log(eventData)
    console.log(eventData.event.clientY, div.offsetHeight);

  });
}

function twoDimPlot(div, dims, chosen_algs){
  dim_indexes = [Dimensions_names.indexOf(dims[0]), Dimensions_names.indexOf(dims[1])]
  console.log('dimensions ' + dim_indexes);
  var data =[];
  for(let i = 0; i<chosen_algs.length; i++){
      algIndex = Algorithms_names.indexOf(chosen_algs[i]);
      alg = Algorithms_data[algIndex]
      console.log(alg);
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
         xaxis:{zeroline:false, title: chosen_algs[0]},
         yaxis:{zeroline:false, title: chosen_algs[1]}
      };

  Plotly.newPlot(div, data, layout);
}
