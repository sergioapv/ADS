
//creates the dimension editor on the sidemenu for the given dimension
function create_dimension_editor(dimension_name){
  var dimension_editor = document.createElement('div');
  dimension_editor.classList.add('Dimension_editor');

  var dimension_title = document.createElement('span');
  dimension_title.classList.add('Dimension_selector');
  dimension_title.innerHTML = dimension_name;

  dim_title_event_handler(dimension_title)

  var algorithm_chooser = document.createElement('div');
  algorithm_chooser.classList.add('Algorithm_chooser');
  Algorithms_names.forEach((algorithm_name) => {
    create_algorithm_chooser(algorithm_name,algorithm_chooser);
  });

  dimension_editor.appendChild(dimension_title);
  dimension_editor.appendChild(algorithm_chooser)

  document.querySelector('.sidemenu').appendChild(dimension_editor);
}

//listeners to minimize dims on sidemenu
function dim_title_event_handler(dimension_title){
  dimension_title.addEventListener('click' , e => {

    let parent = dimension_title.parentNode;
    let children = parent.childNodes;
    children.forEach((child) => {
      if(child.className === 'Algorithm_chooser'){
        if (child.style.display === 'none') {
          child.style.display = 'grid'
        }
        else {
          child.style.display = 'none'
        }
      }
    });
  });
}

//creates check box for algoritm in the sidemenu
function create_algorithm_chooser(algorithm_name,parent_div){
  var choice = document.createElement('div');
  choice.classList.add('choice');

  var edit_choice = document.createElement('span');
  edit_choice.classList.add('edit_choice');
  edit_choice.innerHTML = algorithm_name;

  var input = document.createElement('input');
  input.type = 'checkbox';

  choice.appendChild(edit_choice);
  choice.appendChild(input);

  parent_div.appendChild(choice);
}

//runs throught the dims to create the sidemenu automaticly
function create_sidemenu_automatic(){
  Dimensions_names.forEach((dimension) => {
    create_dimension_editor(dimension);
  });
  algs_chosen();
}
