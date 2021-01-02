function hyperVolume2D(points){
  let area = 0;
  let ordered_points = [];
  for(let i = 0; i<points[0].length; i++){
    ordered_points.push([points[0][i], points[1][i]])
  }

  ordered_points.sort(function(a,b){return a[0] - b[0];});

  for(let i = 0; i<ordered_points.length - 1; i++){
    let xDif = ordered_points[i+1][0] - ordered_points[i][0]
    let y = [ordered_points[i+1][1], ordered_points[i][1]]
    let min_y = Math.min.apply(Math, y)
    area += xDif*min_y
    // console.log(xDif*min_y);
  }

  return area

}

function create_hypervolume_list(div,algs_chosen){

  if (div.parentNode.parentNode.querySelector('.hypervolumes_list')) {
    div.parentNode.parentNode.querySelector('.hypervolumes_list').remove();
  }

  var hypervolume_list = document.createElement('div');
  hypervolume_list.classList.add('hypervolumes_list');
  hypervolume_list.style = 'display:flex;justify-content: center;';

  algs_chosen.forEach((algorithm) => {

    let hypervolume = document.createElement('div');
    hypervolume.classList.add(algorithm);
    hypervolume.id = 'hypervolume';

    let value = document.createElement('span');
    value.innerHTML = 'Hypervolume for ' + algorithm + ':'
    hypervolume.appendChild(value);

    hypervolume_list.appendChild(hypervolume);


  });

  div.parentNode.parentNode.appendChild(hypervolume_list);

}

function update_hypervolume_value(div,alg_name,new_value){
  let hypervolume_span = div.parentNode.parentNode.getElementsByClassName('hypervolumes_list')[0].getElementsByClassName(alg_name)[0].getElementsByTagName('span')[0];

  let comun_part = hypervolume_span.innerHTML.split(':')[0];

  hypervolume_span.innerHTML = comun_part + ': ' + new_value.toFixed(5);
}

function transform_points(points){
  var ordered_points = []

  for(let i = 0; i<points[0].length; i++){
    let pos = []

    for (var j = 0; j < points.length; j++) {
      pos.push(points[j][i])
    }

    ordered_points.push(pos)
  }

  return ordered_points
}

function sort_list(list,dim_index){
  return list.sort(function(a,b) {return a[dim_index] - b[dim_index];});
}

function hyperVolume3D(points){
  var ordered_points = sort_list(transform_points(points),2);

  var hypervolume = 0

  for (var i = 0; i < ordered_points.length; i++) {
    let point = ordered_points[i]
    let height;

    let diferent_z_value = false;

    if (i === 0) {height = point[2];}
    else {
      height = point[2] - ordered_points[i-1][2];
      if (point[2] != ordered_points[i - 1][2]) { //check if the slice has been already taken to account
        diferent_z_value = true
      }
    }

    if (diferent_z_value == true) { //check if the slice has been already taken to account
      let points_at_level = get_points_at_level(ordered_points,point[2]);

      hypervolume += hyperVolume2D(transform_points(points_at_level))*height
    }

  }
  // console.log(hypervolume);
  return hypervolume;
}



function get_points_at_level(points,z){
  var points_at_level = []

  for (var i = 0; i < points.length; i++) {
    if (points[i][2] == z)
      points_at_level.push([points[i][0],points[i][1]]);
  }

  return points_at_level;
}

function hyperVolume4D(points){
  var ordered_points = sort_list(transform_points(points),3);

  var hypervolume = 0

  for (var i = 0; i < ordered_points.length; i++) {
    let point = ordered_points[i]
    let height;

    let diferent_o_value = false;

    if (i === 0) {height = point[3];}
    else {
      height = point[3] - ordered_points[i-1][3];
      if (point[3] != ordered_points[i - 1][3]) { //check if the slice has been already taken to account
        diferent_o_value = true
      }
    }

    if (diferent_o_value == true) { //check if the slice has been already taken to account
      let points_at_level = get_points_at_level_4d(ordered_points,point[3]);
      // console.log(points_at_level);
      // console.log(hyperVolume3D(transform_points(points_at_level)));
      // console.log(height);
      // console.log('\n');
      hypervolume += hyperVolume3D(transform_points(points_at_level))*height
    }

  }
  // console.log(hypervolume);
  return hypervolume;
}

function get_points_at_level_4d(points,o){
  var points_at_level = []

  for (var i = 0; i < points.length; i++) {
    if (points[i][3] == o)
      points_at_level.push([points[i][0],points[i][1],points[i][2]]);
  }
  // console.log(points_at_level);
  return points_at_level;
}
