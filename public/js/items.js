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

  $.ajax('/items')
    .done((items) => {
      console.log(items);
    })
    .fail(() => {
      Materialize.toast('Oops! Unable to retrieve listings.', 3000);
    })

  $('.user-request').on('click', function() {
    Materialize.toast('Request has been sent!', 4000);
  });



})();
