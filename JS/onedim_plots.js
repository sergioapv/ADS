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
      mode: 'markers',
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
