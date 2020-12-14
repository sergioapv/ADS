var welcome_text = document.getElementById("welcome_text");
var input_content = document.getElementById("input_content");
var local_files_choice = document.getElementById('local_files_choice');
var server_files_choice = document.getElementById('server_files_choice');

var Algorithms_names = [];
var Dimensions_names = [];
var Algorithms_data = [];
var Algorithms_colors = [];
var INDEXRECORDER = [];

function get_data_from_start(what){
  switch (what) {
    case 'Algorithms_names':return Algorithms_names;
    case 'Dimensions_names':return Dimensions_names;
    case 'Algorithms_data':return Algorithms_data;
    case 'Algorithms_colors':return Algorithms_colors;
  }
}

document.getElementById('done_button').addEventListener('click', e => {

  console.log(Algorithms_data); //check
  console.log(Algorithms_names); //check
  console.log(Dimensions_names); //check
  console.log(Algorithms_colors); //check

  document.querySelector('.input_file_start').remove();
  document.querySelector('.main_content').style.display = 'block';
  document.querySelector('.sidemenu').style.display = 'block';
  create_sidemenu_automatic();
  create_settings_modal();
});

welcome_text.addEventListener('mouseover',function(){
  welcome_text.style = 'color:gray'
})
welcome_text.addEventListener('mouseleave',function(){
  welcome_text.style = 'color:white'
})
welcome_text.addEventListener('click',function(){
  let welcome_content = document.getElementById('welcome');
  let type_file_chooser = document.getElementById('type_file_chooser');
  welcome_content.style.animation = "fadeOut 1s";
  setTimeout(function(){
    welcome_content.style.display = 'none';
    type_file_chooser.style.display = 'grid';
    type_file_chooser.style.animation = 'fadeIn 2s'
  },1000)
})

document.getElementById('local_files_choice').addEventListener('click' , e => {
  let type_file_chooser = document.getElementById('type_file_chooser');
  let input_content = document.getElementById('input_content');
  let done_button = document.getElementById('done_button');

  type_file_chooser.style.animation = "fadeOut 1s";
  setTimeout(function(){
    type_file_chooser.style.display = 'none';

    done_button.style.animation = 'fadeIn 2s';
    done_button.style.display = 'block';

    input_content.style.animation = 'fadeIn 2s';
    input_content.style.display = 'block';

  },1000)
});

document.getElementById('server_files_choice').addEventListener('click' , e => {
  let type_file_chooser = document.getElementById('type_file_chooser');
  get_files_from_server()
  type_file_chooser.style.animation = "fadeOut 1s";


});

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

//EDu
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
  Algorithms_colors.push(color);
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
  INDEXRECORDER.push([]);
  // let algorithm_index = Algorithms_names.length;
  let num_dimensions = Dimensions_names.length;

  let data = [];

  for (var a = 0; a < num_dimensions ; a++) {
    data.push([]);
  }
  // creates the data with the wanted structure
  files = Array.from(files);
  files.sort(function (a, b) {
    if( a.name.includes('run') && b.name.includes('run')){
      console.log(a.name.split('run')[0])
      console.log(b.name.split('run')[0])
      return (parseInt(a.name.split('run')[1]) - parseInt(b.name.split('run')[1]));
    }
    return;
  });
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    console.log(file.name);
    if (file.name.includes('.csv')) {
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(e) {
          //get the file.
         var csv = event.target.result;
         //split and get the rows in an array
         var rows = csv.split('\n');
         //-2 because csv.split('\n') adds one extra line.
         INDEXRECORDER[INDEXRECORDER.length-1].push(rows.length - 2);
         for (var j=0; j<rows.length - 1; j++){ //runs throught lines
           for (var k = 0; k < data.length; k++) { //runs throught columns
             if(!isNaN(rows[j].split(';')[k])){
               data[k].push(rows[j].split(';')[k]);
             }
           }
         }
       }
     }
   }

   Algorithms_data.push(data);
   files = [];
   console.clear();
   console.log(Algorithms_data);
   console.log(Algorithms_names);
   console.log(Dimensions_names);
   console.log(Algorithms_colors);
 }

 function get_files_from_server(){
   fetch("https://raw.githubusercontent.com/Eduardo-Filipe-Ferreira/ADS-Files-Repository/main/FilesLocation.json")
  .then(response => response.json())
  .then(json => handle_server_files(json[0]));
 }

 function handle_server_files(JsonFile){
   // console.log(JsonFile.Algorithms);
   let partialPath = JsonFile.Algorithms.PartialPath;

   let has_dims = false;

   for (var key in JsonFile.Algorithms.Files) {
    if (JsonFile.Algorithms.Files.hasOwnProperty(key)) {

        let common_name = JsonFile.Algorithms.Files[key].common_name;
        let num_files = JsonFile.Algorithms.Files[key].num_files;
        let folder_name = JsonFile.Algorithms.Files[key].folder_name;

        console.log(folder_name);

        let files_data = []

        if (!Algorithms_names.includes(folder_name)) {
          Algorithms_names.push(folder_name);
          Algorithms_colors.push(getRandomColor())
        }

        for (var i = 0; i < num_files; i++) {

          let file_name = partialPath + '/' + folder_name + '/' + common_name + (i+1) +'.csv';
          // console.log(file_name)

          Plotly.d3.csv(file_name, function(data){
            if(!has_dims){
              for (key in data[0]){
                  if (Dimensions_names.length === 0) {

                    for (var i = 0; i < key.split(';').length; i++) {
                      Dimensions_names.push(key.split(';')[i]);
                      files_data.push([])
                    }
                  }
                  has_dims = true;
                }
              }

            let file_data = processData(data);

            for (var i = 0; i < files_data.length; i++) {
              files_data[i].push(file_data[i]);
            }

          });
        }
        console.log(files_data);
        Algorithms_data.push(files_data);
      }
    }

    document.getElementById('done_button').click();
  }

  function processData(rows) {

    let data = []

    for (var i = 0; i < Dimensions_names.length; i++) {
      data.push([]);
    }

    INDEXRECORDER.push([]);

    INDEXRECORDER[INDEXRECORDER.length-1].push(rows.length - 2);
    for (var j=0; j<rows.length - 1; j++){ //runs throught lines
      for (var k = 0; k < data.length; k++) {
        for(key in rows[j]){
          data[k].push(rows[j][key].split(';')[k]);
        }
      }
    }
    console.log(data);
    return data

  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
