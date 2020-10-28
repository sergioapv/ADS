var algorithms_chosen = [];


var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("settings");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var plotbtn = document.getElementById("Plots");

plotbtn.addEventListener("click", function() {
  handle_graphs();
});

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


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



document.querySelector('.sidemenu_minimizer').addEventListener('click',function(){
  let sidemenu = document.querySelector('.sidemenu');
  let main_content = document.querySelector('.main_content')
  let displayerEditor = document.querySelector('.displayerEditor')

  if (sidemenu.id === "clicked") {//quando ja esta clicado
    sidemenu.id = "not_clicked"
    main_content.style.left = '300px'
    main_content.style.width = 'calc(100% - 300px)'
    let childs = sidemenu.childNodes
    for (var i = 0; i < childs.length; i++) {
      if (childs[i].tagName === 'DIV') {
        childs[i].style.display = 'grid'
      }
    }

  }
  else {
    sidemenu.id = "clicked"
    main_content.style.left = '50px'
    main_content.style.width = 'calc(100% - 50px)'
    main_content.style.marginLeft = '0px'
    let childs = sidemenu.childNodes
    for (var i = 0; i < childs.length; i++) {
      if (childs[i].tagName === 'DIV') {
        childs[i].style.display = 'none'
      }
    }
  }

})

let dimension_type = document.querySelectorAll('.Dimension_selector');
dimension_type.forEach((dimension) => {
  dimension.addEventListener('click',function(){
    let parent = dimension.parentNode;
    let children = parent.childNodes;
    children.forEach((child) => {
      if(child.id === 'Algorithm_chooser'){
        if (child.style.display === 'none') {
          child.style.display = 'grid'
        }
        else {
          child.style.display = 'none'
        }
      }
    });
  });
});

let select_all_list = document.querySelectorAll('.Dimension_selector');
select_all_list.forEach((div) => {
  let selectors = div.parentNode.getElementsByTagName('input');
  // console.log(selectors);
  for (var i = 0; i < selectors.length; i++) {
    if (selectors[i].id === 'select_all') {
      selectors[i].addEventListener('change',function(){
        console.clear()
        let all_selectors = this.parentNode.parentNode.getElementsByTagName('input');
        if (this.checked === true) {
          for (var i = 0; i < all_selectors.length; i++) {
            if(all_selectors[i].checked == true && !all_selectors[i].name.includes('Select_all')){
              var index = algorithms_chosen.indexOf(all_selectors[i].name);
              if (index > -1) {
                algorithms_chosen.splice(index, 1);
              }
            }
            all_selectors[i].checked = true
            if (!all_selectors[i].name.includes('Select_all')) {
              algorithms_chosen.push(all_selectors[i].name);
              console.log(algorithms_chosen);
            }
          }
        }
        else {
          for (var i = 0; i < all_selectors.length; i++) {
            all_selectors[i].checked = false
            if (!all_selectors[i].name.includes('Select_all')) {
              algorithms_chosen.pop(all_selectors[i].name);
              console.log(algorithms_chosen);
            }
          }
        }
      })
    }
    else {
      let class_choice = selectors[i].parentNode;
      let algorithms = class_choice.getElementsByTagName('input');
      for (var j = 0; j < algorithms.length; j++) {
        algorithms[j].addEventListener('change',function(){
          console.clear()
          if (this.checked === true) {
              algorithms_chosen.push(this.name);
              console.log(algorithms_chosen);
          }
          else {
            algorithms_chosen.pop(this.name);
            console.log(algorithms_chosen);
          }
        });
      }
    }
  }

});
