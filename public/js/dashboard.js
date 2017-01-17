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

  console.log($('document'));

  // const returningUser = {
  //   contentType: 'application/json',
  //   data: JSON.stringify({
  //     email,
  //     password
  //   }),
  //   dataType: 'json',
  //   type: 'POST',
  //   url: '/token'
  // };
  //
  // $.ajax()
})();
