// function plotAreaPoints(x, y){
//   let area = 0
//   let points = []
//   let area_points = []
//   if(x.length == y.length){
//     for(let i = 0; i<x.length; i++){
//       points.push([x[i], y[i]])
//     }
//     points.sort(function(a,b){return a[1] - b[1];});
//     let lowest_point = points[0]
//     let point = lowest_point
//     let next_point = [-lowest_point[0],-lowest_point[1]]
//     let i = 0
//     let vector = [1,0]
//     while(true){
//       i ++;
//       let lowest_angle = 360
//       for(let i = 0; i<points.length; i++){
//         let vector2 = [points[i][0] - point[0], points[i][1] - point[1]]
//         let angleDeg = angle(vector, vector2)
//         if(points[i] != point && angleDeg < lowest_angle){
//           next_point = points[i]
//           lowest_angle = angleDeg
//         }
//       }
//       vector = [next_point[0]-point[0], next_point[1] - point[1]]
//       point = next_point
//       area_points.push(point)
//       if(next_point == lowest_point){
//         break;
//       }
//       next_point = [-lowest_point[0],-lowest_point[1]]
//     }
//   }
//   return area_points;
//
// }

// function plotline(leftP, rightP, p){
//   let m = (rightP[0] - leftP[0])/(rightP[1] - leftP[1])
//   let b = p[1] + m*p[0]
//
//   return m*p[0] + b
// }
//
// function plotArea(areaPoints){
//   let sortedList  = []
//   Array.prototype.push.apply(sortedList, areaPoints)
//   sortedList.sort();
//   let upArea = []
//   let downArea = []
//   for(let i = 0; i < areaPoints.length; i++){
//     if (areaPoints[i][1] >= plotline(sortedList[0], sortedList[sortedList.length - 1], areaPoints[i])){
//       upArea.push(areaPoints[i])
//     }else{
//       downArea.push(areaPoints[i])
//     }
//   }
//
//   let upAreaVal = 0
//   upArea.sort()
//   for(let i = 0; i < upArea.length-1; i++){
//     let xdif = Math.abs(upArea[i][0] - upArea[i+1][0])
//     let ydif = Math.abs(upArea[i][1] - upArea[i+1][1])
//     let yy = [upArea[i][1], upArea[i+1][1]]
//     let miny = Math.min.apply(Math, yy)
//     upAreaVal += ((xdif*miny) + (xdif*ydif/2))
//   }
//
//   let downAreaVal = 0
//   downArea.sort()
//   for(let i = 0; i < downArea.length-1; i++){
//     let xdif = Math.abs(downArea[i][0] - downArea[i+1][0])
//     let ydif = Math.abs(downArea[i][1] - downArea[i+1][1])
//     let yy = [downArea[i][1], downArea[i+1][1]]
//     let miny = Math.min.apply(Math, yy)
//     downAreaVal += ((xdif*miny) + (xdif*ydif/2))
//   }
//   return upAreaVal - downAreaVal
// }
//
//   function angle(v1, v2){
//     let angle = (Math.atan2(v2[1], v2[0]) - Math.atan2(v1[1], v1[0])) * 180/ Math.PI
//     if(angle < 0 ){
//       return angle + 360
//     }
//     return angle
//   }
//
//
// function pointDist(p1, p2){
//   var a = p1[0] - p2[0];
//   var b = p1[1] - p2[1];
//   return Math.sqrt( a*a + b*b );
// }



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
    // console.log(xDif*min_y);
  }

  return area

}
