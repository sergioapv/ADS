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


//Draws plot for 1 dimension, algs(list with the algs to be represented), plotType('box' or 'violin'), div to draw the plot
function makeOneDimPlot(dim, chosen_algs_names, plotType, div){
  if (chosen_algs_names.length > 1 && plotType === 'progressive') {
    alert('Progressive plot is only available for one algorithm')
    return;
  }
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
     let dimensionIndex = elementIndex(Dimensions_names, dim);
     let trace = {}

     for (var i = 0; i<chosen_algs_names.length; i++){
       let algorithm_index = elementIndex(Algorithms_names, chosen_algs_names[i]);
       var x = Algorithms_data[algorithm_index][dimensionIndex]
       let max = Math.max.apply(Math,x);
       console.log(max);
       var y = []
       for (var j = 0; j < x.length; j++) {
         y.push(j.toString())
       }

       let animation_type = [{
         //fill: 'tozeroy',
         type: 'scatter',
         mode: 'lines',
         line: {color: Algorithms_colors[algorithm_index]}
      }]

       let frames = []
       var n = x.length;
       for (var j = 0; j < n; j++) {
        frames[j] = {data: [{x: [], y: []}]}
        frames[j].data[0].x =  y.slice(0, j+1);
        frames[j].data[0].y =  x.slice(0, j+1);
      }
      console.log(frames);
       trace = {
         xaxis: {
          type: 'linear',
          range: [
            0, n-1
           ],
           showgrid: false,
           showline: false,
           showticklabels: false,
           zeroline: false
         },
         yaxis: {
           type: 'linear',
           range: [
             frames[n-1].data[0].x[0],
             frames[n-1].data[0].x[n-1]
           ],
           showgrid: false,
           showline: false,
           showticklabels: false,
           zeroline: false
         },
       }
       data.push(trace)
       Plotly.newPlot(div, animation_type, data).then(function() {
         Plotly.animate(div, frames, {
         frame: {
           duration: 0,
           redraw: true
         }
       });
     });
     data = []
    }
  }
  if (plotType !== 'box') {
    display_annotations_listener(div,dim)
  }
}

//displays annotations for points file's path, file's line and values
function display_annotations_listener(div,dim){
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
            arrowcolor: point.fullData.line.color,
            font: {size:12},
            bordercolor: point.fullData.line.color,
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
