Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv', function(err, rows){
function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}

var z_data=[ ]
for(i=0;i<24;i++)
{
  z_data.push(unpack(rows,i));
}

// console.log(z_data);


var data = [{
           z: z_data,
           type: 'surface'
        }];

var layout = {
  title: 'Mt Bruno Elevation',
  autosize: false,
  width: 500,
  height: 500,
  margin: {
    l: 65,
    r: 50,
    b: 65,
    t: 90,
  }
};
Plotly.newPlot('ADAM_D1', data, layout);
});


function handle_graphs(){
  var dims= getDimensions();
  console.log('nr de dimensoes = '+ dims.length);
  switch (dims.length) {
    case 1:
      plotBoxPlot(dims[0]);
      break;
    case 2:

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

function plotBoxPlot(dim){
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

  let aux = [[], [], [], [], []];

  for(var i = 0; i < algorithms_chosen.length; i++){
    if(algorithms_chosen[i].includes('ADAMW')){
      aux[0] = ADAMW[index];
    }
    if(algorithms_chosen[i].includes('RADAM')){
      aux[1] = RADAM[index];
    }
    if(algorithms_chosen[i].includes('RMSprop')){
      aux[2] = RMSPROP[index];
    }
    if(algorithms_chosen[i].includes('SGD')){
      aux[3] = SGD[index];
    }
    else{
      aux[4] = ADAM[index];
    }
  }
  makeBoxPlot(aux);
}

function create_dimension_div(dimensions){
  let title = '';
  dimensions.forEach((dimension, i) => {
    if (dimension.includes('ADAM')) {
      title += 'ADAM'
    }
    else if (dimension.includes('ADAMW')) {
      title += 'ADAMW'
    }
    else if (dimension.includes('RADAM')) {
      title += 'RADAM'
    }
    else if (dimension.includes('RMSprop')) {
      title += 'RMSprop'
    }
    else if (dimension.includes('SGD')) {
      title += 'SGD'
    }
    if (i != dimensions.length -1) {
      title += 'vs'
    }
  });

  var div = document.createElement('div');

  var title_div = document.createElement('div')
  title_div.class = 'Dimension_title'

  var title_span = document.createElement('span')
  title_span.innerHTML = title

  var graphs_content_div = document.createElement('div')
  graphs_content_div.id = 'graphs_content'
}

function makeBoxPlot(algs) {
  const myNode = document.getElementById("graphs_content");
  myNode.innerHTML = '';
  var div = document.createElement("div");
  div.id = 'D1_graph'
  var para = document.createElement("P");
  document.getElementById("graphs_content").appendChild(para);
  document.getElementById("graphs_content").appendChild(div);
  document.getElementById("graphs_content").appendChild(para);
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
  console.log(columns.length);

  var data = [];
  var trace1 = {};
  for (var i = 0; i<columns.length; i++){

     trace1 = {
        y: columns[i],
        type: 'box',
        name: algNames[i],
        marker: {
          color: colors[i]
        },
        boxpoints: false
      };

      data.push(trace1);
  }

  console.log(data);

Plotly.newPlot(div, data);
}
