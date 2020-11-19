var welcome_text = document.getElementById("welcome_text");
var input_content = document.getElementById("input_content");

var Algorithms_names = [];
var Dimensions_names = [];
var Algorithms_data = [];
var Algorithms_colores = [];

function get_data_from_start(what){
  switch (what) {
    case 'Algorithms_names':return Algorithms_names;
    case 'Dimensions_names':return Dimensions_names;
    case 'Algorithms_data':return Algorithms_data;
    case 'Algorithms_colores':return Algorithms_colores;
  }
}

document.getElementById('done_button').addEventListener('click', e => {
  document.querySelector('.input_file_start').remove();
  document.querySelector('.main_content').style.display = 'block';
  document.querySelector('.sidemenu').style.display = 'block';
  create_sidemenu_automatic();
});

welcome_text.addEventListener('mouseover',function(){
  welcome_text.style = 'color:gray'
})
welcome_text.addEventListener('mouseleave',function(){
  welcome_text.style = 'color:white'
})
welcome_text.addEventListener('click',function(){
  let welcome_content = document.getElementById('welcome');
  let input_content = document.getElementById('input_content');
  welcome_content.style.animation = "fadeOut 1s";
  setTimeout(function(){
    welcome_content.style.display = 'none';
    input_content.style.display = 'block';
    document.getElementById('done_button').style.display = 'block';
    input_content.style.animation = 'fadeIn 2s'
  },1000)
})

document.querySelectorAll('.drop-zone__input').forEach((inputElement) => {
  const dropZoneElement = inputElement.closest('.drop-zone');

  dropZoneElement.addEventListener('click', e => {
    inputElement.click();
  });

  inputElement.addEventListener('change', e => {
    if (inputElement.files.length === 1) {

      updateThumbnail(dropZoneElement,inputElement.files[0])
      display_file_data(inputElement.files[0])

    }
    if (inputElement.files.length > 1) {

      var theFiles = inputElement.files;
      var relativePath = theFiles[0].webkitRelativePath;
      var folder_name = relativePath.split("/")[0];

      updateThumbnail(dropZoneElement,folder_name)
      display_folder_data(folder_name,inputElement.files)

    }
  });

  dropZoneElement.addEventListener('dragover', e=> {
    e.preventDefault();
    dropZoneElement.classList.add('drop-zone--over');
  });

  ['dragleave','dragend'].forEach(type => {
    dropZoneElement.addEventListener(type, e=>{
      e.preventDefault();
      dropZoneElement.classList.remove('drop-zone--over');
    });
  });

  dropZoneElement.addEventListener('drop', e => {
    e.preventDefault();
    console.log(e.dataTransfer);
    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;

      if (e.dataTransfer.items[0].webkitGetAsEntry().isDirectory) {
        var firs_item = e.dataTransfer.items[0];
        const files = []
        var dirReader = firs_item.webkitGetAsEntry().createReader();
        dirReader.readEntries(function(entries) {
          for (var i=0; i<entries.length; i++) {
            if (entries[i].isFile) {
              files.push(entries[i].file());
            }
          }
          console.log(files);
          display_folder_data(firs_item.webkitGetAsEntry().name,files)

          updateThumbnail(dropZoneElement, firs_item.webkitGetAsEntry().name);
        });

      }

      else {
        display_file_data(inputElement.files[0])
      }

    }
    dropZoneElement.classList.remove('drop-zone--over');
  });
});
//*****************************https://github.com/GoogleChrome/chrome-app-samples/blob/master/samples/filesystem-access/js/app.js **********************
function readAsText(fileEntry, callback) {
  fileEntry.file(function(file) {
    var reader = new FileReader();

    reader.onerror = errorHandler;
    reader.onload = function(e) {
      callback(e.target.result);
    };

    reader.readAsText(file);
  });
}

function loadFileEntry(_chosenEntry) {
  chosenEntry = _chosenEntry;
  chosenEntry.file(function(file) {
    readAsText(chosenEntry, function(result) {
      textarea.value = result;
    });
    // Update display.
    saveFileButton.disabled = false; // allow the user to save the content
    displayEntryData(chosenEntry);
  });
}
//************************************************************************************************************************************************

function updateThumbnail(dropZoneElement,file){
  let thumbnailElement = dropZoneElement.querySelector('.drop-zone__thumb');

  if (dropZoneElement.querySelector('.drop-zone__prompt').style.display !== 'none') {
    dropZoneElement.querySelector('.drop-zone__prompt').style.display = 'none';
  }

  if (!thumbnailElement) {
    thumbnailElement = document.createElement('div');
    thumbnailElement.classList.add('drop-zone__thumb');
    dropZoneElement.appendChild(thumbnailElement);

  }
  if (typeof file === 'file') {
    thumbnailElement.dataset.label = file.name;
  }
  if (typeof file === 'string') {
    thumbnailElement.dataset.label = file;
  }


  thumbnailElement.style.backgroundImage = "url('./images/folder_icon.png')";
}

function display_file_data(file){
  if (document.querySelector('.file_data')) {
    document.querySelector('.file_data').remove();
  }
  const file_data = document.createElement('div');
  file_data.classList.add('file_data');

  const filename_content = document.createElement('div');
  filename_content.classList.add('filename_content');
  var filename = document.createElement('span');
  filename.innerHTML = 'Algoritmo:'
  var input_name = document.createElement('input');
  input_name.type = 'text';
  input_name.size = '30';
  input_name.value = file.name;
  input_name.style = 'text-align: center;'

  filename_content.appendChild(filename)
  filename_content.appendChild(input_name)

  file_data.appendChild(filename_content)

  document.getElementById('input_content').appendChild(file_data);
  if (typeof file === 'directory') {
    display_folder_data(file.name)
  }

  //get_file_dimensions(file)
}

function display_folder_data(folder_name,files){
  if (document.querySelector('.file_data')) {
    document.querySelector('.file_data').remove();
  }
  const file_data = document.createElement('div');
  file_data.classList.add('file_data');

  const filename_content = document.createElement('div');
  filename_content.classList.add('filename_content');
  var filename = document.createElement('span');
  filename.innerHTML = 'Algoritmo:'
  var input_name = document.createElement('input');
  input_name.type = 'text';
  input_name.size = '30';
  input_name.value = folder_name;
  input_name.style = 'text-align: center;'
  input_name.classList.add('algorithm-name-input_' + Algorithms_names.length);
  Algorithms_names.push(folder_name)

  input_name.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      algorithm_index = input_name.classList[0].split('_')[1]
      Algorithms_names[algorithm_index] = input_name.value;
      console.log(Algorithms_names);
    }
  });



  filename_content.appendChild(filename)
  filename_content.appendChild(input_name)

  file_data.appendChild(filename_content)

  document.getElementById('input_content').appendChild(file_data);

  get_folder_dimensions(files,file_data);
}

function get_folder_dimensions(files,file_data_div){
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (file.name.includes('.csv')) {
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(e) {
        var csv = e.target.result;

        let dimensions = csv.split('\n')[0].split(';')
        console.log(dimensions);
        dimensions.forEach( (dimension,index) => {
          if (Dimensions_names.length > 0) {
            if (!Dimensions_names.includes(dimension)) {
              Dimensions_names.push(dimension);
            }
          }
          else {
            Dimensions_names.push(dimension);
          }

          create_data_visualizer(dimension,file_data_div,index)
        });

        let container = document.querySelector('.dimensions_content');

        var cor = document.createElement('span');
        cor.innerHTML = 'Cor:';

        var color_chooser = document.createElement('input');
        color_chooser.id = 'color_getter';
        color_chooser.type = 'color';
        color_chooser.value = '#ff0000';

        container.appendChild(cor);
        container.appendChild(color_chooser);


        if(!document.getElementById('add_button')){

          var add_button = document.createElement('span');
          add_button.id = 'add_button';
          add_button.innerHTML = 'Adicionar';

          add_button.addEventListener('click' , e =>{
            add_file_data(files)
            add_button_action();
          });
          file_data_div.appendChild(add_button);
        }

      }
      break;
    }
  }
}

function create_data_visualizer(dimension,file_data_div,index,files){
  var input = document.createElement('input');
  input.classList.add('input_' + index);
  input.type = 'text';
  input.size = '30';
  input.value = dimension;
  input.style = 'text-align: center;'

  if (!document.querySelector('.dimensions_content')) {
    var container = document.createElement('div');
    container.classList.add('dimensions_content');

    var title = document.createElement('span');
    title.innerHTML = 'Dimensões:';
    container.appendChild(title);

    container.appendChild(input)

    file_data_div.appendChild(container);
  }
  else {
    document.querySelector('.dimensions_content').appendChild(input);
  }

  input.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      alert('Remember, this action will modefy the name for all algorithms');
      Dimensions_names[index] = input.value;
      console.log(Dimensions_names);
    }

  });

}

function add_button_action(){
  updateAddedDimensions();
  let color = document.getElementById('color_getter').value;
  Algorithms_colores.push(color);
  document.querySelector('.drop-zone__thumb').remove();
  document.querySelector('.drop-zone__prompt').style.display = 'block';
  document.querySelector('.file_data').remove();


  let start_content = document.querySelector('.start_content');

  start_content.style.animation = "fadeIn 1s";
}


function updateAddedDimensions(){
  var filename_content = document.querySelector('.filename_content');
  var input = filename_content.getElementsByTagName('input')[0];

  var dim_added = document.createElement('span');
  dim_added.classList.add('dim_added');
  dim_added.innerHTML = input.value;

  document.querySelector('.Dimensions_added').appendChild(dim_added);
}

function add_file_data(files){
  // let algorithm_index = Algorithms_names.length;
  let num_dimensions = Dimensions_names.length;

  let data = [];

  for (var a = 0; a < num_dimensions ; a++) {
    data.push([]);
  }
  // creates the data with the wanted structure

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (file.name.includes('.csv')) {
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(e) {
          //get the file.
         var csv = event.target.result;
         //split and get the rows in an array
         var rows = csv.split('\n');

         for (j=0; j<rows.length - 1; j++){ //runs throught lines
           for (var k = 0; k < data.length; k++) { //runs throught columns
             if(!isNaN(rows[j].split(';')[k])){
               data[k].push(rows[j].split(';')[k]);
             }
           }
         }
       }
     }
   }

   Algorithms_data.push([data]);
   files = [];
   console.clear();
   console.log(Algorithms_data);
   console.log(Algorithms_names);
   console.log(Dimensions_names);
   console.log(Algorithms_colores);
 }
