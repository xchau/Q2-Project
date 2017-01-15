(function() {
  'use strict';

  $(document).ready(function(){
    $('.modal').modal();
  });

  $('.button-collapse').sideNav({
      menuWidth: 250,
      edge: 'right',
      closeOnClick: true
    }
  );

  // $('.submit').on('click', (event) => {
  //   event.preventDefault();
  //   alert("Hello Sarah")
  // });



})();
