document.querySelector('.sidemenu_minimizer').addEventListener('click',function(){
  let sidemenu = document.querySelector('.sidemenu');
  let main_content = document.querySelector('.main_content')
  if (sidemenu.id === "clicked") {//quando ja esta clicado
    sidemenu.id = "not_clicked"
    main_content.style.left = '300px'
    main_content.style.width = 'calc(100% - 300px)'

  }
  else {
    sidemenu.id = "clicked"
    main_content.style.left = '50px'
    main_content.style.width = 'calc(100% - 50px)'
    main_content.style.marginLeft = '0px'

  }

})
