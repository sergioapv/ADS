function threeDimScatterPlot(div, dims, chosen_algs){
  let data = [];
  dims = Array.from(dims);
  dim1 = elementIndex(Dimensions_names, dims[0]);
  dim2 = elementIndex(Dimensions_names, dims[1]);
  dim3 = elementIndex(Dimensions_names, dims[2]);

  create_hypervolume_list(div,chosen_algs)
  create_range_changer_buttons(div,chosen_algs,dims)

  for(var i = 0; i < chosen_algs.length; i++){
    algIndex = elementIndex(Algorithms_names, chosen_algs[i]);
    var trace1 = {
    name: chosen_algs[i],
  	x:Algorithms_data[algIndex][dim1], y: Algorithms_data[algIndex][dim2], z: Algorithms_data[algIndex][dim3],
  	mode: 'markers',
    hovertemplate: '<i>' + dims[0] +'</i>: %{x}'  +
                   '<br><i>' + dims[1] + '</i>: %{y}' +
                   '<br><i>' + dims[2] + '</i>: %{z}',
  	marker: {
      color: Algorithms_colors[algIndex],
  		size: 3,
      text: [Algorithms_names[dim1],Algorithms_names[dim2],Algorithms_names[dim3]],
  		},
  	type: 'scatter3d'
    }
    showlegend:true;

    update_hypervolume_value(div,chosen_algs[i],hyperVolume3D([Algorithms_data[algIndex][dim1], Algorithms_data[algIndex][dim2],Algorithms_data[algIndex][dim3]]));
    data.push(trace1);
  }

  var layout = {

    scene: {
  		xaxis:{title: dims[0]},

  		yaxis:{title: dims[1]},

  		zaxis:{title: dims[2]}
    },
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
    },
    showlegend:true,

};

  Plotly.newPlot(div, data, layout);

  div.addEventListener('click', e => {
    div.once('plotly_click',
      function(data){
        console.log(data);
        let file = getFilePath(data.points[0].data.name, data.points[0].pointNumber)[0]
        let algIndex = elementIndex(chosen_algs, data.points[0].data.name)
        let sum = 0
        let interval = [];
        let opacityPoints = [];
        let borderColor = [];
        let pointswidth = [];
        console.log(algIndex);
        for (var i = 0; i < INDEXRECORDER[algIndex].length; i++) {
          sum += INDEXRECORDER[algIndex][i][0]
          if(file.includes(INDEXRECORDER[algIndex][i][1])){
            interval.push(sum - INDEXRECORDER[algIndex][i][0])
            interval.push(sum)
            break;
          }
        }

        console.log(interval);

        let x = []
        let y = []
        for (var i = 0; i < Algorithms_data[algIndex][0].length; i++) {
          if (i >= interval[0] && i <= interval[1]){
            opacityPoints.push(1)
            borderColor.push('#ff0000')
          }else{
            opacityPoints.push(0.05)
            borderColor.push(Algorithms_colors[algIndex])

          }
        }

        var point = data.points[0],
            newAnnotation = {
              x: point.x,
              y: point.y,
              z: point.z,
              arrowhead: 6,
              ax: 0,
              ay: -120,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              arrowcolor: Algorithms_colors[algIndex],
              font: {size:12},
              bordercolor: Algorithms_colors[algIndex],
              borderwidth: 3,
              borderpad: 4,
              text:
                    '<b>Point Atributes</b><br><br>' +
                    '<b>' + dims[0] + '</b><br>'+(point.x) +
                    '<br><b>' + dims[1] + '</b><br>'+(point.y) +
                    '<br><b>' + dims[2] + '</b><br>'+(point.z) +
                    '<br><b>File Path</b>  <br>'+(getFilePath(point.data.name, point.pointNumber)[0]) +
                    '<br><b>Line</b>  <br>'+(getFilePath(point.data.name, point.pointNumber)[1])
          },
          newIndex = (div.layout.scene.annotations || []).length;
       // delete instead if clicked twice
      console.log(newIndex);
      if(newIndex > 0) {
         var foundCopy = false;
         div.layout.scene.annotations.forEach(function(ann, sameIndex) {
           if(ann.text === newAnnotation.text ) {
             Plotly.restyle(div,  {"marker.color": Algorithms_colors[algIndex]}, elementIndex(chosen_algs, point.data.name) )
             foundCopy = true;
           }
           Plotly.relayout(div, 'scene.annotations[' + sameIndex + ']', 'remove');

         });
         if(foundCopy){
           return;
         }

       }
       console.log(div.data);
       Plotly.relayout(div, 'scene.annotations['+ 0 + ']', 'remove');
       Plotly.relayout(div, 'scene.annotations[' + 0 + ']', newAnnotation);
       for (var i1 = 0; i1 < div.data.length; i1++) {
         console.log('painting ');
         let index = elementIndex(Algorithms_names, div.data[i1].name)
         Plotly.restyle(div,  {"marker.color": Algorithms_colors[index]}, i1)
       }
       Plotly.restyle(div,  {"marker.color": [borderColor]}, elementIndex(chosen_algs, point.data.name) )


    })
  });


}
