function create_matrix_density(div, dims , chosen_algs){

  // var matrix_size = 1;


  var rows = 1;
  var columns = 1;
  if (!(chosen_algs.length == columns * rows)) {
    while (chosen_algs.length >= columns * rows) {
      columns++;
      if (chosen_algs.length >= columns * rows) {
        break
      }
      else {
        rows++;
        if (chosen_algs.length >= columns * rows) {
          break
        }
      }
    }
  }


  // let columns_rows = ''
  let temp_rows = '';
  let temp_columns = '';
  console.log(rows);
  console.log(columns);
  console.log(chosen_algs.length);

  if (columns * rows != 1) {

    var graphs_content = div.parentNode;

    div.remove();

    let density_matrix = document.createElement('div');
    density_matrix.classList.add('density_matrix');

    // for (var i = 0; i < matrix_size; i++) {
    //   columns_rows += '360px '
    // }

    for (var i = 0; i < rows; i++) {
      temp_rows += '360px '
    }

    for (var i = 0; i < columns; i++) {
      temp_columns += '360px '
    }

    density_matrix.style.gridTemplateColumns = temp_columns;
    density_matrix.style.gridTemplateRows = temp_rows;

    chosen_algs.forEach((algorithm) => {
      let graphmatrix = document.createElement('div')
      graphmatrix.classList.add('graphmatrix');
      console.log(graphmatrix);

      density_matrix.appendChild(graphmatrix);

      twoDimDensityPlot_4_matrix(graphmatrix, dims, [algorithm])

    });

    graphs_content.appendChild(density_matrix);
  }
  else {
    twoDimDensityPlot(div, dims, chosen_algs)
  }

}
function twoDimDensityPlot_4_matrix(div, dims, chosen_algs){
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
    width:360,
    height:360,
    showlegend: false,
    autosize: true,
    margin: {
        l: 50,
        r: 0,
        b: 50,
        t: 0
    },
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
