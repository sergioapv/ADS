var welcome_text = document.getElementById("welcome_text");
var input_content = document.getElementById("input_content");
var local_files_choice = document.getElementById('local_files_choice');
var server_files_choice = document.getElementById('server_files_choice');

//Data structures for all plots
var Algorithms_names = []; //stores Algorithms names
var Dimensions_names = []; //Stores Dimensions names
var Algorithms_data = [];  //stores All algorithm data by algorithm by dimension
var Algorithms_colors = [];//stores Algorithms colores
var INDEXRECORDER = [];    //stores Algorithms Files length and name

//return given type of data structures
function get_data_from_start(what){
  switch (what) {
    case 'Algorithms_names':return Algorithms_names;
    case 'Dimensions_names':return Dimensions_names;
    case 'Algorithms_data':return Algorithms_data;
    case 'Algorithms_colors':return Algorithms_colors;
  }
}
//Event listener for local files input confirmation
document.getElementById('done_button').addEventListener('click', e => {

  console.log(Algorithms_data);
  console.log(Algorithms_names);
  console.log(Dimensions_names);
  console.log(Algorithms_colors);
  console.log(INDEXRECORDER);
  //removes current page with a fade out visual effect
  document.querySelector('.input_file_start').style.animation = "fadeOut 1s";

  //After previous animation is done shows the main content and sidemenu with a fade in effect
  setTimeout(function(){
    document.querySelector('.input_file_start').remove();

    document.querySelector('.main_content').style.display = 'block';
    document.querySelector('.sidemenu').style.display = 'block';

    document.querySelector('.main_content').style.animation = "fadeIn 2s";
    document.querySelector('.sidemenu').style.animation = "fadeIn 2s";

    create_sidemenu_automatic();
    create_settings_modal();
  },1000)


});
//animations for welcome page
welcome_text.addEventListener('mouseover',function(){
  welcome_text.style = 'color:gray'
})
welcome_text.addEventListener('mouseleave',function(){
  welcome_text.style = 'color:white'
})
//Event when user clicks on the welcome button - shows the type of files to demonstrade
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

//handler for if the user chooses to see local files
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

//handler for if the user chooses to see files stored in the server
document.getElementById('server_files_choice').addEventListener('click' , e => {
  let type_file_chooser = document.getElementById('type_file_chooser');
  //gets the files from the server
  get_files_from_server();
  //fades the page out
  type_file_chooser.style.animation = "fadeOut 1s";
});

//handler if local files are droped !! not fully working
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

//Update thumbnail image when user loads a file
function updateThumbnail(dropZoneElement,file){
  let thumbnailElement = dropZoneElement.querySelector('.drop-zone__thumb');

  //if the dropzone is shown then hide
  if (dropZoneElement.querySelector('.drop-zone__prompt').style.display !== 'none') {
    dropZoneElement.querySelector('.drop-zone__prompt').style.display = 'none';
  }

  //if there's no thumnbnail element then create it
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

  //sets thumnbnail image with folder image
  thumbnailElement.style.backgroundImage = "url('./images/folder_icon.png')";
}

//display load file data to the user
function display_file_data(file){
  //in case there's already a folder being showned then remove it's information
  if (document.querySelector('.file_data')) {
    document.querySelector('.file_data').remove();
  }
  //create all elements to show the folder information
  const file_data = document.createElement('div');
  file_data.classList.add('file_data');

  const filename_content = document.createElement('div');
  filename_content.classList.add('filename_content');
  var filename = document.createElement('span');
  filename.innerHTML = 'Algorithm:'
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
  filename.innerHTML = 'Algorithm:'

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

  var files_config_content = document.createElement('div');
  files_config_content.classList.add('files_config_content');

  var files_config_title = document.createElement('span');
  files_config_title.innerHTML = 'Name pattern:'

  var files_config_input = document.createElement('input');
  files_config_input.type = 'text';
  files_config_input.size = '30';
  files_config_input.style = 'text-align: center;';

  var file_separator_content = document.createElement('div');
  file_separator_content.classList.add('file_separator_content');

  var file_separator_title = document.createElement('span');
  file_separator_title.innerHTML = 'Separator:'

  var file_separator_input = document.createElement('input');
  file_separator_input.type = 'text';
  file_separator_input.size = '30';
  file_separator_input.style = 'text-align: center;';

  files_config_content.appendChild(files_config_title);
  files_config_content.appendChild(files_config_input);

  file_separator_content.appendChild(file_separator_title);
  file_separator_content.appendChild(file_separator_input);

  filename_content.appendChild(filename)
  filename_content.appendChild(input_name)

  file_data.appendChild(filename_content);
  file_data.appendChild(files_config_content);
  file_data.appendChild(file_separator_content)

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

        let dimensions = csv.split('\n')[0].split(';');

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

        //create color color_chooser
        var cor = document.createElement('span');
        cor.innerHTML = 'Color:';

        var color_chooser = document.createElement('input');
        color_chooser.id = 'color_getter';
        color_chooser.type = 'color';
        color_chooser.value = '#ff0000';

        container.appendChild(cor);
        container.appendChild(color_chooser);

        //if there's not a add data button then create it
        if(!document.getElementById('add_button')){

          var add_button = document.createElement('span');
          add_button.id = 'add_button';
          add_button.innerHTML = 'Add Data';

          //when cicked saves the files data on the data structures
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

//creates data visuals for user
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
    title.innerHTML = 'Dimensions:';
    container.appendChild(title);

    container.appendChild(input)

    file_data_div.appendChild(container);
  }
  else {
    document.querySelector('.dimensions_content').appendChild(input);
  }
  //when the dimension name changer input get the enter key pressed changes it's name on the data structure
  input.addEventListener('keydown', e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      alert('Remember, this action will modefy the name for all algorithms');
      Dimensions_names[index] = input.value;
      console.log(Dimensions_names);
    }

  });

}

//prepares page to get a new folder loaded by removing the previous folder's information
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
  //creates a new slot to add the files' dimensions and names
  INDEXRECORDER.push([]);

  let num_dimensions = Dimensions_names.length;

  let data = [];

  for (var a = 0; a < num_dimensions ; a++) {
    data.push([]);
  }
  // creates the data with the wanted structure
  files = Array.from(files);
  files.sort(function (a, b) {
    if( a.name.includes('run') && b.name.includes('run')){
      return (parseInt(a.name.split('run')[1]) - parseInt(b.name.split('run')[1]));
    }
    return;
  });
  //runs throught the folder's files
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    let filename = file.name;
    console.log(valid_file_name(file.name));
    if (valid_file_name(file.name) == true) {
      var splitter = document.getElementsByClassName('file_separator_content')[0].getElementsByTagName('input')[0].value
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(e) {
         //get the file.
         var csv = event.target.result;
         //split and get the rows in an array
         var rows = csv.split('\n');
         //-2 because csv.split('\n') adds one extra line.
         INDEXRECORDER[INDEXRECORDER.length-1].push([rows.length - 2, filename]);
         for (var j=0; j<rows.length - 1; j++){ //runs throught lines
           for (var k = 0; k < data.length; k++) { //runs throught columns
             if(!isNaN(rows[j].split(splitter)[k])){
               data[k].push(rows[j].split(splitter)[k]);
             }
           }
         }
       }
     }
   }

   Algorithms_data.push(data);
   files = [];

 }
 //checks if the file name is valid with the pattern given by the githubusercontent
 function valid_file_name(file_name){
   var patterns = document.getElementsByClassName('files_config_content')[0].getElementsByTagName('input')[0].value.split('*');
   console.log(patterns);
   console.log(file_name);
   var valid = true;

   for (var i = 1; i < patterns.length; i++) {
     if (!file_name.includes(patterns[i])) {
       valid = false;
       break;
     }
   }
   return valid;
 }

//simulates getting files from a server by using a public Github Repository
 function get_files_from_server(){
   //link with file containning the files and folders distribution
   fetch("https://raw.githubusercontent.com/Eduardo-Filipe-Ferreira/ADS-Files-Repository/main/FilesLocation.json")
  .then(response => response.json())
  .then(json => handle_server_files(json[0]));
 }
 //Handels the file that contains the distribution of the files in the Repository
 function handle_server_files(JsonFile){
   let partialPath = JsonFile.Algorithms.PartialPath;

   let has_dims = false;

   for (var key in JsonFile.Algorithms.Files) {
    if (JsonFile.Algorithms.Files.hasOwnProperty(key)) {

        let common_name = JsonFile.Algorithms.Files[key].common_name;
        let num_files = JsonFile.Algorithms.Files[key].num_files;
        let folder_name = JsonFile.Algorithms.Files[key].folder_name;

        let folder_data = []
        //if the new algorithm is not in the data structures then add it and create a slot for index recorder
        if (!Algorithms_names.includes(folder_name)) {
          Algorithms_names.push(folder_name);
          Algorithms_colors.push(getRandomColor())
          INDEXRECORDER.push([]);
        }
        for (var i = 0; i < num_files; i++) {
          let lastIndex = INDEXRECORDER.length - 1;

          let file_name = partialPath + '/' + folder_name + '/' + common_name + (i+1) +'.csv';

          let name = common_name + (i+1) +'.csv';
          //reads file
          Plotly.d3.csv(file_name, function(data){

            if(!has_dims){
              for (key in data[0]){
                  if (Dimensions_names.length === 0) {

                    for (var j = 0; j < key.split(';').length; j++) {
                      Dimensions_names.push(key.split(';')[j]);
                    }
                  }
                  has_dims = true;
                }
              }
            let file_data = processData(data, lastIndex, name);

            if (folder_data.length === 0) {
              for (var k = 0; k < Dimensions_names.length; k++) {
                folder_data.push([]);
              }
            }


            for (var i = 0; i < folder_data.length; i++) {
              for (var k = 0; k < file_data[i].length; k++) {
                folder_data[i].push(file_data[i][k]);
              }
            }
          });
        }

        Algorithms_data.push(folder_data);
      }
    }

    document.getElementById('done_button').click();
  }

  //adds the information of each file on the index recorder data structure
  function processData(rows, lastIndex, file_name) {

    let data = []

    for (var i = 0; i < Dimensions_names.length; i++) {
      data.push([]);
    }

    INDEXRECORDER[lastIndex].push([rows.length, file_name]);
    for (var j=0; j<rows.length; j++){ //runs throught lines
      for (var k = 0; k < data.length; k++) {
        for(key in rows[j]){
          data[k].push(rows[j][key].split(';')[k]);
        }
      }
    }
    return data
  }

  //creates random colors for the folders added from the server
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
