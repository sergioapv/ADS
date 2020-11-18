var ADAM = [[],[],[],[]];
var RADAM = [[],[],[],[]];
var RMSPROP = [[],[],[],[]];
var ADAMW = [[],[],[],[]];
var SGD = [[],[],[],[]];

var ADAMCOLOR = '#ff0000';
var RADAMCOLOR = '#ff0000';
var RMSPROPCOLOR = '#ff0000';
var ADAMWCOLOR = '#ff0000';
var SGDCOLOR = '#ff0000';

var INDEXRECORDER = [[], [], [], [], []];

var ADAMPATH = '';
var ADAMWPATH = '';
var RADAMPATH = '';
var RMSPROPATH = '';
var SGDPATH = '';

var dimNames = [];
var algNames = [];

var algorithm = [[],[],[],[]];

document.getElementById('adamcolor').addEventListener("input", function() {
  color = document.getElementById('adamcolor').value;
  algColor('ADAM', color)
  });

document.getElementById('adamwcolor').addEventListener("input", function() {
  color = document.getElementById('adamwcolor').value;
  algColor('ADAMW', color)
  });

document.getElementById('radamcolor').addEventListener("input", function() {
  color = document.getElementById('radamcolor').value;
  algColor('RADAM', color)
  });

document.getElementById('rmspropcolor').addEventListener("input", function() {
  color = document.getElementById('rmspropcolor').value;
  algColor('RMSprop', color)
  });

document.getElementById('sgdcolor').addEventListener("input", function() {
  color = document.getElementById('sgdcolor').value;
  algColor('SGD', color)
  });

  function algColor(alg, color){
    switch (alg) {
      case 'ADAM':
        ADAMCOLOR = color;
        break;
      case 'RADAM':
        RADAMCOLOR = color;
        break;
      case 'RMSprop':
        RMSPROPCOLOR = color;
        break;
      case 'SGD':
        SGDCOLOR = color;
        break;
      case 'ADAMW':
        ADAMWCOLOR = color;
        break;
    }
  }


document.getElementById('adamdir').addEventListener('change', (event) => {
  attributeData(event)
});
document.getElementById('radamdir').addEventListener('change', (event) => {
  attributeData(event)
});
document.getElementById('adamwdir').addEventListener('change', (event) => {
  attributeData(event)
});
document.getElementById('sgddir').addEventListener('change', (event) => {
  attributeData(event)
});
document.getElementById('rmspropdir').addEventListener('change', (event) => {
  attributeData(event)
});

function attributeData(ev) {
  const fileList = ev.target.files;
  let alg = fileList[0].webkitRelativePath.split('/')[0];
  alg = alg.split("-")[0];
  algNames.push(alg);
  console.log(alg);
  var csv_files = [];
  var accuracy = [];
  var loss = [];
  var val_accuracy = [];
  var val_loss = []

  algorithm = [[],[],[],[]];
  sizes = [];

  for(i = 0; i < fileList.length; i++){
    if(fileList[i].name.includes('.csv')){
      csv_files.push(fileList[i]);
      var reader = new FileReader();
      reader.readAsText(fileList[i]);
      reader.onload = function(event) {
       //get the file.
       var csv = event.target.result;
       //split and get the rows in an array
       var rows = csv.split('\n');
       sizes.push(rows.length -1);

       if(dimNames.length === 0){
         dimNames.push(rows[0].split(';')[0]);
         dimNames.push(rows[0].split(';')[1]);
         dimNames.push(rows[0].split(';')[2]);
         dimNames.push(rows[0].split(';')[3]);
       }
       for (j=0; j<rows.length - 1; j++){
         if( j!=0 ){
           accuracy.push(parseFloat(    rows[j].split(';')[0]));
           loss.push(parseFloat(        rows[j].split(';')[1]));
           val_accuracy.push(parseFloat(rows[j].split(';')[2]));
           val_loss.push(parseFloat(    rows[j].split(';')[3]));
         }
       }
         algorithm[0].push(accuracy)
         algorithm[1].push(loss)
         algorithm[2].push(val_accuracy)
         algorithm[3].push(val_loss)
         accuracy = [];
         loss = [];
         val_accuracy = [];
         val_loss = []
       }
     }
  }

  console.log(algNames);
  console.log(dimNames);
  switch (alg) {
    case 'ADAM':
      ADAM = [[],[],[],[]];
      ADAM = algorithm;
      INDEXRECORDER[0] = sizes;
      break;
    case 'ADAMW':
      ADAMW = [[],[],[],[]];
      ADAMW = algorithm;
      INDEXRECORDER[1] = sizes;
      break;
    case 'RADAM':
      RADAM = [[],[],[],[]];
      RADAM = algorithm;
      INDEXRECORDER[2] = sizes;
      break;
    case 'RMSprop':
      RMSPROP = [[],[],[],[]];
      RMSPROP = algorithm;
      INDEXRECORDER[3] = sizes;
      break;
    case 'SGD':
      SGD =  [[],[],[],[]];
      SGD = algorithm;
      INDEXRECORDER[4] = sizes;
      break;

  }
  console.log(ADAM);
  console.log(ADAMW);
  console.log(RADAM);
  console.log(RMSPROP);
  console.log(SGD);
}
