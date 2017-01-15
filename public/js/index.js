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

})();


// make a request to server.js
// server.js has users route send to that path
