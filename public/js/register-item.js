(function() {
  'use strict';

  // MATERIALIZE
  $(document).ready(function() {
    $('select').material_select();
  });

  $('.button-collapse').sideNav({
      menuWidth: 250,
      edge: 'right',
      closeOnClick: true
    }
  );

})();
