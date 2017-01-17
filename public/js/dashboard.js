'use strict';
(function() {
  $(document).ready(() => {
    $('.modal').modal();
  });

  $('.button-collapse').sideNav({
    menuWidth: 250,
    edge: 'right',
    closeOnClick: true
  }
  );

  $('tbody').on('click', 'i.accept', (event) => {
    Materialize.toast('Caring is sharing confirmation email sent!', 3000);
    $(event.target).parent().parent().remove();
  });

  $('tbody').on('click', 'i.decline', (event) => {
    Materialize.toast('Too bad so sad confirmation email sent!', 3000);
    $(event.target).parent().parent().remove();
  });

  const itemsListed = {
    contentType: 'application/json',
    dataType: 'json',
    type: 'GET',
    url: '/dashboard'
  };

  $.ajax(itemsListed)
    .done((items) => {
      // render items to dashboard here
      console.log(items);
    })
    .fail(($xhr) => {
      console.log($xhr.responseText);
      Materialize.toast($xhr.responseText, 3000);
    });
})();
