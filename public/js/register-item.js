(function() {
  'use strict';

  // MATERIALIZE INITIALIZATION //
  $(document).ready(function() {
    $('select').material_select();
  });

  $('.button-collapse').sideNav({
      menuWidth: 250,
      edge: 'right',
      closeOnClick: true
    }
  );

  const item = $('#itemName').val();

  

})();
