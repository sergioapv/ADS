var welcome_text = document.getElementById("welcome_text");
var input_content = document.getElementById("input_content");

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
    input_content.style.animation = 'fadeIn 2s'
  },1000)
})

document.querySelectorAll('.drop-zone__input').forEach((inputElement) => {
  const dropZoneElement = inputElement.closest('.drop-zone');

  dropZoneElement.addEventListener('click', e => {
    inputElement.click();
  });

  inputElement.addEventListener('change', e => {
    if (inputElement.file.length>0) {
      updateThumbnail(dropZoneElement,inputElement.files[0])
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
    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;
      console.log(inputElement.files);
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);

      display_file_data(e.dataTransfer.files[0])

    }
    dropZoneElement.classList.remove('drop-zone--over');
  });
});


function updateThumbnail(dropZoneElement,file){
  let thumbnailElement = dropZoneElement.querySelector('.drop-zone__thumb');

  if (dropZoneElement.querySelector('.drop-zone__prompt')) {
    dropZoneElement.querySelector('.drop-zone__prompt').remove();
  }

  if (!thumbnailElement) {
    thumbnailElement = document.createElement('div');
    thumbnailElement.classList.add('drop-zone__thumb');
    dropZoneElement.appendChild(thumbnailElement);

  }

  thumbnailElement.dataset.label = file.name;

  //show thumbnail for image files
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
  input_name.placeholder = file.name;
  input_name.style = 'text-align: center;'

  filename_content.appendChild(filename)
  filename_content.appendChild(input_name)

  file_data.appendChild(filename_content)

  document.getElementById('input_content').appendChild(file_data);

}
