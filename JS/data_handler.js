var ADAM = [[],[],[],[]];
var RADAM = [[],[],[],[]];
var RMSPROP = [[],[],[],[]];
var ADAMW = [[],[],[],[]];
var SGD = [[],[],[],[]];

var ADAMCOLOR = '';
var RADAMCOLOR = '';
var RMSPROPCOLOR = '';
var ADAMWCOLOR = '';
var SGDCOLOR = '';



var algorithm = [[],[],[],[]];

//   const fileSelector = document.getElementsByClassName('option');
//   fileSelector.addEventListener('change', (event) => {
//     const fileList = event.target.files;
//     var csv_files = [];
//     var accuracy = [];
//     var loss = [];
//     var val_accuracy = [];
//     var val_loss = []
//     algorithm = [[],[],[],[]];
//
//     for(i = 0; i < fileList.length; i++){
//       if(fileList[i].name.includes('.csv')){
//         csv_files.push(fileList[i]);
//         var reader = new FileReader();
//         reader.readAsText(fileList[i]);
//         reader.onload = function(event) {
//            //get the file.
//            var csv = event.target.result;
//            //split and get the rows in an array
//            var rows = csv.split('\n');
//            for (j=0; j<rows.length-1; j++){
//              if( j!=0 ){
//                accuracy.push(parseFloat(rows[j].split(';')[0]));
//                loss.push(parseFloat(rows[j].split(';')[1]));
//                val_accuracy.push(parseFloat(rows[j].split(';')[2]));
//                val_loss.push(parseFloat(rows[j].split(';')[3]));
//              }
//            }
//            algorithm[0].push(accuracy)
//            algorithm[1].push(loss)
//            algorithm[2].push(val_accuracy)
//            algorithm[3].push(val_loss)
//            accuracy = [];
//            loss = [];
//            val_accuracy = [];
//            val_loss = []
//
//          }
//        }
//     }
//     var alg = document.getElementById('algoritmos').value;
//     if (alg == 'ADAM'){
//       ADAM = algorithm;
//     }
//     if (alg == 'RADAM'){
//       RADAM = algorithm;
//     }
//     if (alg == 'RMSprop'){
//       RMSPROP = algorithm;
//     }
//     if (alg == 'ADAMW'){
//       ADAMW = algorithm;
//     }
//     if (alg == 'SGD'){
//       SGD = algorithm;
//     }
//   });
//
// document.getElementById('favcolor').addEventListener("click", function() {
//   var alg = document.getElementById('algoritmos').value;
//   color = document.getElementById('favcolor').value;
//
//   switch (alg) {
//     case 'ADAM':
//       ADAMCOLOR = color;
//       break;
//     case 'RADAM':
//       RADAMCOLOR = color;
//       break;
//     case 'RMSprop':
//       RMSPROPCOLOR = color;
//       break;
//     case 'SGD':
//       SGDCOLOR = color;
//       break;
//     case 'ADAMW':
//       ADAMWCOLOR = color;
//       break;
//   }
//   });


document.getElementById('adamdir').addEventListener('change', (event) => {
  attributeData('ADAM',event)
});
document.getElementById('radamdir').addEventListener('change', (event) => {
  attributeData('RADAM',event)
});
document.getElementById('adamwdir').addEventListener('change', (event) => {
  attributeData('ADAMW',event)
});
document.getElementById('sgddir').addEventListener('change', (event) => {
  attributeData('SGD',event)
});
document.getElementById('rmspropdir').addEventListener('change', (event) => {
  attributeData('RMSprop',event)
});

function attributeData(alg, ev) {
  const fileList = ev.target.files;
  var csv_files = [];
  var accuracy = [];
  var loss = [];
  var val_accuracy = [];
  var val_loss = []
  algorithm = [[],[],[],[]];

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
         for (j=0; j<rows.length-1; j++){
           if( j!=0 ){
             accuracy.push(parseFloat(rows[j].split(';')[0]));
             loss.push(parseFloat(rows[j].split(';')[1]));
             val_accuracy.push(parseFloat(rows[j].split(';')[2]));
             val_loss.push(parseFloat(rows[j].split(';')[3]));
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
  switch (alg) {
    case 'ADAM':
      ADAM = [[],[],[],[]];
      ADAM = algorithm;
      break;
    case 'RADAM':
      RADAM = [[],[],[],[]];
      RADAM = algorithm;
      break;
    case 'RMSprop':
      RMSPROP = [[],[],[],[]];
      RMSPROP = algorithm;
      break;
    case 'SGD':
      SGD =  [[],[],[],[]];
      SGD = algorithm;
      break;
    case 'ADAMW':
      ADAMW = [[],[],[],[]];
      ADAMW = algorithm;
      break;
  }
  console.log(ADAM);
  console.log(ADAMW);
}
// document.getElementById('favcolor').addEventListener("click", function() {
// var alg = document.getElementById('algoritmos').value;
// color = document.getElementById('favcolor').value;
//
// switch (alg) {
//   case 'ADAM':
//     ADAMCOLOR = color;
//     break;
//   case 'RADAM':
//     RADAMCOLOR = color;
//     break;
//   case 'RMSprop':
//     RMSPROPCOLOR = color;
//     break;
//   case 'SGD':
//     SGDCOLOR = color;
//     break;
//   case 'ADAMW':
//     ADAMWCOLOR = color;
//     break;
// }
// });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// document.getElementById('BoxPlotBtn').addEventListener("click", function() {
//   var checkedValues = [];
//   var inputElements = document.getElementsByClassName('option');
//   for(var i=0; inputElements[i]; ++i){
//     if(inputElements[i].checked){
//          checkedValues.push(inputElements[i].value);
//     }
//   }
//
//   console.log(checkedValues);
//
//   for(var i = 0; < checkedValues.length; i++){
//
//   }
//
//   if(checkedValues.includes('accuracy')){
//     makeBoxPlot(ADAM[0],'accuracy');
//   }
//   if(checkedValues.includes('loss')){
//     makeBoxPlot(ADAM[1], 'loss');
//   }
//   if(checkedValues.includes('val_accuracy')){
//     makeBoxPlot(ADAM[2], 'val_accuracy');
//   }
//   if(checkedValues.includes('val_loss')){
//     makeBoxPlot(ADAM[3], 'val_loss');
//   }
// });
//
//
//
// function makeBoxPlot(dimension, col) {
//   column = [];
//   for(var i=0; i < dimension.length; ++i){
//     for(var j=0;j < dimension[i].length; ++j){
//       column.push(dimension[i][j]);
//     }
//   }
//   var trace1 = {
//     y: column,
//     type: 'box',
//     boxpoints: false
//   };
//   var data = [trace1];
//
// Plotly.newPlot('plot', data);
// }
