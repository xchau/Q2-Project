/* eslint-disable max-len */
'use strict';
(function() {
  $(document).ready(() => {
    $('.modal').modal();
    $('ul.tabs').tabs();
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
      // $('#items').empty();
      if (!items.length) {
        const $noItems = $('<p>').addClass('flow-text no-items blue-grey-text text-lighten-4').text('You are not sharing any items at this time');

        $('#items').append($noItems);
      }
      // render items to dashboard here
      for (const item of items) {
        const { title } = item;
        const imgPath = item.image_path;

        const $cardColDiv = $('<div>').addClass('col s6 m3 items-card');
        const $cardDiv = $('<div>').addClass('card');
        const $cardImgDiv = $('<div>').addClass('card-image');
        const $cardImg = $('<img>').attr('alt', 'filler').attr('src', `./images/${imgPath}`);
        const $cardContent = $('<div>').addClass('card-content');
        const $titleP = $('<p>').text(title);
        const $cardActionDiv = $('<div>').addClass('card-action');
        const $cardActionAnchor = $('<a>').attr('href', '#modal1').text('Confim Delete Modal');
        const $cardIconSpan = $('<span>').addClass('destroy');
        const $cardIcon = $('<i>').addClass('material-icons fav-icon').text('clear');

        $cardIconSpan.append($cardIcon);

        $cardImgDiv.append($cardImg);
        $cardContent.append($titleP);
        $cardActionDiv.append($cardActionAnchor).append($cardIconSpan);

        $cardDiv.append($cardImgDiv).append($cardContent).append($cardActionDiv);
        $cardColDiv.append($cardDiv);
        $('#items').append($cardColDiv);
      }
      console.log(items);
    })
    .fail(($xhr) => {
      console.log($xhr.responseText);
      Materialize.toast($xhr.responseText, 3000);
    });

  $('#add-item').submit((event) => {
    event.preventDefault();

    const title = $('#title').val().trim();
    const itemDescription = $('#item-description').val().trim();
    const imgFile = $('#img-file').val().trim();

    if (!title) {
      return Materialize.toast('Title must not be blank', 3000);
    }

    if (!itemDescription) {
      return Materialize.toast('Item description must not be blank', 3000);
    }

    if (!imgFile) {
      return Materialize.toast('Image file must not be blank', 3000);
    }

    const newItem = {
      contentType: 'application/json',
      data: JSON.stringify({
        title,
        description: itemDescription,
        imagePath: imgFile
      }),
      dataType: 'json',
      type: 'POST',
      url: '/items'
    };

    $.ajax(newItem)
      .done(() => {
        console.log('testing');
        window.location.href = '../dashboard.html'
      })
      .fail(($xhr) => {
        console.log($xhr.responseText);
        Materialize.toast($xhr.responseText, 3000);
      });
  });
})();
