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

  $('.user-request').on('click', () => {
    Materialize.toast('Request has been sent!', 4000);
  });

  // INITIAL AJAX CALL TO RENDER SCREEN //
  $.ajax('/items')
    .done((items) => {
      console.log(items);
    })
    .fail(() => {
      Materialize.toast('Oops! Unable to retrieve listings.', 3000);
    });

  // GRAB USER KEYWORD & MAKE AJAX CALL //
  let keyword;

  $('#submit').on('click', (event) => {
    event.preventDefault();

    keyword = $('#search-bar').val().trim();

    const options = {
      contentType: 'application/json',
      type: 'GET',
      url: `/items/search?q=${keyword}`
    }
    $.ajax(options)
      .done((items) => {
        console.log(items);
      })
      .fail((err) => {
        Materialize.toast(err.responseText, 3000);
      });
  });
})();
