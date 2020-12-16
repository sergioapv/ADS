var algorithms_chosen = [];

var plotType1 = 'box';

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("settings");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var plotbtn = document.getElementById("Plots");

plotbtn.addEventListener("click", function() {
  // console.log(getDimensions());
  handle_graphs(plotType1);
});


// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.querySelector('.sidemenu_minimizer').addEventListener('click',function(){
  let sidemenu = document.querySelector('.sidemenu');
  let main_content = document.querySelector('.main_content')
  let displayerEditor = document.querySelector('.displayerEditor')

  if (sidemenu.id === "clicked") {//quando ja esta clicado
    sidemenu.id = "not_clicked"
    main_content.style.left = '300px'
    main_content.style.width = 'calc(100% - 300px)'
    let childs = sidemenu.childNodes
    for (var i = 0; i < childs.length; i++) {
      if (childs[i].tagName === 'DIV') {
        childs[i].style.display = 'grid'
      }
    }

  }
  else {
    sidemenu.id = "clicked"
    main_content.style.left = '50px'
    main_content.style.width = 'calc(100% - 50px)'
    main_content.style.marginLeft = '0px'
    let childs = sidemenu.childNodes
    for (var i = 0; i < childs.length; i++) {
      if (childs[i].tagName === 'DIV') {
        childs[i].style.display = 'none'
      }
    }
  }

})

let dimension_type = document.querySelectorAll('.Dimension_selector');
dimension_type.forEach((dimension) => {
  dimension.addEventListener('click',function(){
    let parent = dimension.parentNode;
    let children = parent.childNodes;
    children.forEach((child) => {
      if(child.id === 'Algorithm_chooser'){
        if (child.style.display === 'none') {
          child.style.display = 'grid'
        }
        else {
          child.style.display = 'none'
        }
      }
    });
  });
});

function algs_chosen(){
  let select_all_list = document.querySelectorAll('.Dimension_selector');
  select_all_list.forEach((div) => {
    let selectors = div.parentNode.getElementsByTagName('input');
    for (var i = 0; i < selectors.length; i++) {
      if (selectors[i].id === 'select_all') {
        selectors[i].addEventListener('change',function(){
          console.log(selectors);
          console.clear()
          let all_selectors = this.parentNode.parentNode.getElementsByTagName('input');
          if (this.checked === true) {
            for (var i = 0; i < all_selectors.length; i++) {
              if(all_selectors[i].checked == true && !all_selectors[i].name.includes('Select_all')){
                var index = algorithms_chosen.indexOf(all_selectors[i].name);
                if (index > -1) {
                  algorithms_chosen.splice(index, 1);
                }
              }
              all_selectors[i].checked = true
              if (!all_selectors[i].name.includes('Select_all')) {
                algorithms_chosen.push(all_selectors[i].name);
                console.log(algorithms_chosen);
              }
            }
          }
          else {
            for (var i = 0; i < all_selectors.length; i++) {
              all_selectors[i].checked = false
              if (!all_selectors[i].name.includes('Select_all')) {
                algorithms_chosen.pop(all_selectors[i].name);
                console.log(algorithms_chosen);
              }
            }
          }
        })
      }
      else {
        let class_choice = selectors[i].parentNode;
        let algorithms = class_choice.getElementsByTagName('input');
        for (var j = 0; j < algorithms.length; j++) {
          // console.log(algorithms[j]);
          algorithms[j].addEventListener('change',function(){
            console.clear()
            if (this.checked === true) {
                algorithms_chosen.push(this.parentNode.textContent + '_' + this.parentNode.parentNode.parentNode.childNodes[0].textContent);
                console.log(algorithms_chosen);
            }
            else {
              let index = algorithms_chosen.indexOf(this.parentNode.textContent + '_' + this.parentNode.parentNode.parentNode.childNodes[0].textContent);
              if (index > -1) {
                algorithms_chosen.splice(index,1);
              }
              console.log(algorithms_chosen);
            }
          });
        }
      }
    }

  });
}
