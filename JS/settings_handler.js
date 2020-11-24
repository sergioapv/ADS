function create_settings_modal(){
  Algorithms_names.forEach((Algorithm_name , i ) => {
    let algorithm_getter = document.createElement('div');
    algorithm_getter.classList.add('Algorithm_getter');

    let algorithm_name_changer = document.createElement('input');
    algorithm_name_changer.classList.add('algorithm_name_changer');
    algorithm_name_changer.id = 'name_changer_' + i
    algorithm_name_changer.type = 'text';
    algorithm_name_changer.placeholder = Algorithm_name;

    // algorithm_name_changer.addEventListener('input', e => {
    //   change_algorithm_name(i,algorithm_name_changer.value);
    // });

    let color_settings = document.createElement('input');
    color_settings.classList.add('color_settings');
    color_settings.id = 'color_changer_' + i;
    color_settings.type = 'color'
    color_settings.value = Algorithms_colors[i];

    // color_settings.addEventListener('input', e =>{
    //   change_algorithm_color(i,color_settings.value);
    // });

    algorithm_getter.appendChild(algorithm_name_changer);
    algorithm_getter.appendChild(color_settings)
    document.querySelector('.modal-content').appendChild(algorithm_getter);
  });

  var submit_changes_button = document.createElement('span');
  submit_changes_button.classList.add('submit_changes_button');
  submit_changes_button.innerHTML = 'Confirm';

  submit_changes_button.addEventListener('click', e =>{
    submit_changes();
    document.querySelector('.modal').style.display = 'none';
  });

  document.querySelector('.modal-content').appendChild(submit_changes_button);

}

function submit_changes(){
  document.querySelectorAll('.Algorithm_getter').forEach((getter , i) => {
    // let inputs = getter.getElementsByTagName('input');

    let name_input = document.getElementById('name_changer_' + i);

    let color_input = document.getElementById('color_changer_' + i);

    console.log(i);
    console.log(name_input.value);
    console.log(color_input.value);
    console.log(Algorithms_names);
    console.log(Algorithms_colors);
    console.log(Algorithms_data);

    change_algorithm_name(i,name_input.value);
    change_algorithm_color(i, color_input.value);
  });
  update_sidemenu()

}

function change_algorithm_name(index,new_name){
  if (new_name != '') {
    Algorithms_names[index] = new_name;
  }
}

function change_algorithm_color(index,new_color){
  Algorithms_colors[index] = new_color;
}

function update_sidemenu(){
  document.querySelectorAll('.Dimension_editor').forEach((dim_edit) => {
    dim_edit.remove()
  });
  algorithms_chosen = []
  create_sidemenu_automatic();

}
