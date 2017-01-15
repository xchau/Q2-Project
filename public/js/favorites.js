(function() {
  'use strict';

  // MATERIALIZE INITIALIZATION //
  $('.button-collapse').sideNav({
      menuWidth: 250,
      edge: 'right',
      closeOnClick: true
    }
  );

  $('.modal').modal({
      dismissible: true,
      opacity: .5,
      }
  );

  // DELETE FAVS FROM DOM //
  $('.destroy').on('click', (event) => {
    const $target = $(event.target);

    const elemId = $target.parent().parent().parent().parent().prop('id');

    $(`#${elemId}`).remove();
  });

})();
