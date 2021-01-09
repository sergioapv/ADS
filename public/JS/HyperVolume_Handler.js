
//calculates the hypervolume for 2d points given and array x and array y
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
  }

  return area

}

//creates the hypervolume spans that show the hypervolumes' value for each given algoritm
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

//creates a pop up to change the min and max values for caculating the hypervolumes' values
function create_min_max_modal(div,dims,alg_name){
  var alg_index = Algorithms_names.indexOf(alg_name);

  var modal_range_list = document.createElement('div');
  modal_range_list.classList.add('modal_range_list');
  modal_range_list.style = 'display:block;';

  var modal_content_range_list = document.createElement('div');
  modal_content_range_list.classList.add('modal-content_range_list');

  modal_range_list.appendChild(modal_content_range_list);

  var close = document.createElement('span');
  close.classList.add('close_modal')
  close.innerHTML = '+';
  add_close_listener(close)

  modal_content_range_list.appendChild(close);

  var range_list = document.createElement('div');
  range_list.classList.add('range_list');

  modal_content_range_list.appendChild(range_list)

  let alg_title = document.createElement('span');
  alg_title.style = 'font-weight:bold; font-size: 20px; margin-bottom: 15px;';
  alg_title.innerHTML = alg_name;

  range_list.appendChild(alg_title)

  dims.forEach((dimension) => {

    let dim_index = Dimensions_names.indexOf(dimension);

    let min = Math.min.apply(Math, Algorithms_data[alg_index][dim_index]);
    let max = Math.max.apply(Math, Algorithms_data[alg_index][dim_index]);

    let range_choice = document.createElement('div');
    range_choice.classList.add('range_choice');
    range_choice.style = 'margin:20px;'

    let dim_title = document.createElement('span');
    dim_title.innerHTML = dimension + ':';

    range_choice.appendChild(dim_title);

    let range_choice_min = document.createElement('div');
    range_choice_min.classList.add('range_choice_min');

    let min_title = document.createElement('span')
    min_title.innerHTML = 'Minimum Value : ' + min.toFixed(6);

    let min_slider = document.createElement('input');
    min_slider.type = 'range';
    min_slider.classList.add('min')

    min_slider.min = min;
    min_slider.max = max;
    min_slider.value = min;

    min_slider.step = '0.000001'

    range_choice_min.appendChild(min_title);
    range_choice_min.appendChild(min_slider);


    let range_choice_max = document.createElement('div');
    range_choice_max.classList.add('range_choice_max');

    let max_title = document.createElement('span')
    max_title.innerHTML = 'Maximum Value : ' + min.toFixed(6);

    let max_slider = document.createElement('input');
    max_slider.type = 'range';
    max_slider.classList.add('max')

    max_slider.min = min;
    max_slider.max = max;
    max_slider.value = min;

    max_slider.step = '0.000001'

    range_choice_max.appendChild(max_title);
    range_choice_max.appendChild(max_slider);

    range_choice.appendChild(range_choice_min);
    range_choice.appendChild(range_choice_max);

    range_list.appendChild(range_choice);

    range_events_handler(min_slider,max_slider)
  });

let range_change_button = document.createElement('span');
range_change_button.classList.add('range_change_button');
range_change_button.innerHTML = 'Change'

change_button_listener(range_change_button)

modal_content_range_list.appendChild(range_change_button)

div.parentNode.parentNode.appendChild(modal_range_list)
}

//creates listener for the button to confirm the changes for min and max values
function change_button_listener(range_change_button){
  range_change_button.addEventListener('click' , e => {

    var points = []

    var mins_maxs = []

    let range_list = range_change_button.parentNode.getElementsByClassName('range_choice')

    let algorithm = range_change_button.parentNode.getElementsByTagName('span')[1].innerHTML

    let graph = range_change_button.parentNode.parentNode.parentNode.getElementsByClassName('graph')[0]

    var dims = 0

    for (var i = 0; i < range_list.length; i++) {
      let choice = range_list[i];

      let dim = choice.getElementsByTagName('span')[0].innerHTML.split(':')[0];

      dims++

      let min = parseFloat(choice.getElementsByClassName('min')[0].value);
      let max = parseFloat(choice.getElementsByClassName('max')[0].value);

      if (min>max) {
        alert('Please select a maximum value higher than a minimum value');
        return;
      }

      let dim_points = Algorithms_data[Algorithms_names.indexOf(algorithm)][Dimensions_names.indexOf(dim)];

      mins_maxs.push([min,max])
      // dim_points = validate_points(dim_points,min,max);

      points.push(dim_points);

    }

    if (dims === 3) {
      points = validate_3D_points(points,mins_maxs)
      update_hypervolume_value(graph,algorithm,hyperVolume3D(points))
    }
    if (dims === 4) {
      points = validate_4D_points(points,mins_maxs)
      update_hypervolume_value(graph,algorithm,hyperVolume4D(points))
    }

    range_change_button.parentNode.parentNode.remove()
  });
}

//checks if the given point is within the given min and max range
function valid_point(point,min,max){
  return point >= min && point <= max
}

//validates 3D points for all dims ranges
function validate_3D_points(points,mins_maxs){
  let valid_points = [[],[],[]]
  for (var i = 0; i < points[0].length; i++) {
    let dim1_point = points[0][i]
    let dim2_point = points[1][i]
    let dim3_point = points[2][i]

    if (valid_point(dim1_point,mins_maxs[0][0],mins_maxs[0][1]) &&
        valid_point(dim2_point,mins_maxs[1][0],mins_maxs[1][1]) &&
        valid_point(dim3_point,mins_maxs[2][0],mins_maxs[2][1])) {
      valid_points[0].push(dim1_point)
      valid_points[1].push(dim2_point)
      valid_points[2].push(dim3_point)
    }
  }
  return valid_points;
}

//validates 4D points for all dims ranges
function validate_4D_points(points,mins_maxs){
  let valid_points = [[],[],[],[]]
  for (var i = 0; i < points[0].length; i++) {
    let dim1_point = points[0][i]
    let dim2_point = points[1][i]
    let dim3_point = points[2][i]
    let dim4_point = points[3][i]

    if (valid_point(dim1_point,mins_maxs[0][0],mins_maxs[0][1]) &&
        valid_point(dim2_point,mins_maxs[1][0],mins_maxs[1][1]) &&
        valid_point(dim3_point,mins_maxs[2][0],mins_maxs[2][1]) &&
        valid_point(dim3_point,mins_maxs[3][0],mins_maxs[3][1])) {
      valid_points[0].push(dim1_point)
      valid_points[1].push(dim2_point)
      valid_points[2].push(dim3_point)
      valid_points[3].push(dim4_point)
    }
  }
  return valid_points;
}



//listener for closing the pop up
function add_close_listener(close){
  close.addEventListener('click' , e => {
    close.parentNode.parentNode.remove();
  });
}

//listener for showing the values on the sliders given by the user
function range_events_handler(min_slider,max_slider){
  min_slider.addEventListener('change' , e => {

    let comun_part  = min_slider.parentNode.getElementsByTagName('span')[0].innerHTML.split(':')[0];

    comun_part += ': ' + parseFloat(min_slider.value).toFixed(6)

    min_slider.parentNode.getElementsByTagName('span')[0].innerHTML = comun_part
  });
  max_slider.addEventListener('change' , e => {
    let comun_part  = max_slider.parentNode.getElementsByTagName('span')[0].innerHTML.split(':')[0];

    comun_part += ': ' + parseFloat(max_slider.value).toFixed(6)

    max_slider.parentNode.getElementsByTagName('span')[0].innerHTML = comun_part
  });

}

//creates the buttons to change the range for hypervolume calculations for given algorithms and dims
function create_range_changer_buttons(div,algs_chosen,dims){
  var hypervolume_range_changer = document.createElement('div');
  hypervolume_range_changer.classList.add('hypervolume_range_changer');
  hypervolume_range_changer.style = 'display:flex; justify-content: center;'

  algs_chosen.forEach((algorithm) => {
    let range_changer = document.createElement('span');
    range_changer.classList.add('range_changer');

    range_changer.innerHTML = 'Change value ranges for ' + algorithm + "'s hypervolume"

    range_changer.addEventListener('click' , e => {

      create_min_max_modal(div,dims,algorithm)

    });

    hypervolume_range_changer.appendChild(range_changer);
  });

  div.parentNode.parentNode.appendChild(hypervolume_range_changer)

}

//updates the value of the hypervolume calculated on given algoritm
function update_hypervolume_value(div,alg_name,new_value){
  let hypervolume_span = div.parentNode.parentNode.getElementsByClassName('hypervolumes_list')[0].getElementsByClassName(alg_name)[0].getElementsByTagName('span')[0];

  let comun_part = hypervolume_span.innerHTML.split(':')[0];

  hypervolume_span.innerHTML = comun_part + ': ' + new_value.toFixed(5);
}

//transformation of a matrix function
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

//sorts list by given index
function sort_list(list,dim_index){
  return list.sort(function(a,b) {return a[dim_index] - b[dim_index];});
}

//calculates the hypervolume for 3D points
//hypervolume is calculated by getting all points on the same z value and getting their area (using 2D hypervolume) and multipling by the height
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
  return hypervolume;
}


//gets all the points in the same Z level
function get_points_at_level(points,z){
  var points_at_level = []

  for (var i = 0; i < points.length; i++) {
    if (points[i][2] == z)
      points_at_level.push([points[i][0],points[i][1]]);
  }

  return points_at_level;
}

//calculates the hypervolume for 3D points
//hypervolume is calculated by getting all points on the same level of the fourth dim and getting their valume (using 3D hypervolume) and multipling by the height
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

      hypervolume += hyperVolume3D(transform_points(points_at_level))*height
    }

  }

  return hypervolume;
}

//returns values on the same level for the 4th dim
function get_points_at_level_4d(points,o){
  var points_at_level = []

  for (var i = 0; i < points.length; i++) {
    if (points[i][3] == o)
      points_at_level.push([points[i][0],points[i][1],points[i][2]]);
  }

  return points_at_level;
}
