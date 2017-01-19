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

  $('.log-out').click(() => {
    const options = {
      contentType: 'application/json',
      dataType: 'json',
      type: 'DELETE',
      url: '/token'
    };

    $.ajax(options)
      .done(() => {
        Materialize.toast('You are now logged out', 3000);
      })
      .fail((err) => {
        console.log($xhr.responseText);
        Materialize.toast($xhr.responseText, 3000);
      });
  });

})();
