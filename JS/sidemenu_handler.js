var algorithms_chosen = [];

document.querySelector('.sidemenu_minimizer').addEventListener('click',function(){
  let sidemenu = document.querySelector('.sidemenu');
  let main_content = document.querySelector('.main_content')
  let displayerEditor = document.querySelector('.displayerEditor')

  if (sidemenu.id === "clicked") {//quando ja esta clicado
    sidemenu.id = "not_clicked"
    main_content.style.left = '300px'
    main_content.style.width = 'calc(100% - 300px)'
    displayerEditor.style.display = 'grid'

  }
  else {
    sidemenu.id = "clicked"
    main_content.style.left = '50px'
    main_content.style.width = 'calc(100% - 50px)'
    main_content.style.marginLeft = '0px'
    displayerEditor.style.display = 'none'
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

let select_all_list = document.querySelectorAll('.Dimension_selector');
select_all_list.forEach((div) => {
  let selectors = div.parentNode.getElementsByTagName('input');
  // console.log(selectors);
  for (var i = 0; i < selectors.length; i++) {
    if (selectors[i].id === 'select_all') {
      selectors[i].addEventListener('change',function(){
        console.clear()
        let all_selectors = this.parentNode.parentNode.getElementsByTagName('input');
        if (this.checked === true) {
          for (var i = 0; i < all_selectors.length; i++) {
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
        algorithms[j].addEventListener('change',function(){
          console.clear()
          if (this.checked === true) {
              algorithms_chosen.push(this.name);
              console.log(algorithms_chosen);
          }
          else {
            algorithms_chosen.pop(this.name);
            console.log(algorithms_chosen);
          }
        });
      }
    }
  }

});
