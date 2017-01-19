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

  const renderRequests = function(requests) {
    for (const request of requests) {
      const itemTitle = request.title;
      const borrowName = request.name;
      const reqItemId = request.id;

      const $mainRow = $('<div>').addClass('row');
      const $titleDiv = $('<div>').attr('id', 'request-title').addClass('col s4 center').text(itemTitle);
      const $borrowRow = $('<div>').attr('id', 'request-from').addClass('col s4 center').text(borrowName);
      const $declineDiv = $('<div>').addClass('col s2 center');
      const $declineIcon = $('<i>').addClass('decline material-icons small red-text').attr('item-id', reqItemId).text('clear');
      const $acceptDiv = $('<div>').addClass('col s2 center');
      const $acceptIcon = $('<i>').addClass('accept material-icons small green-text').attr('item-id', reqItemId).text('done');

      $declineDiv.append($declineIcon);
      $acceptDiv.append($acceptIcon);
      $mainRow.append($titleDiv).append($borrowRow).append($declineDiv).append($acceptDiv);

      $('#requests').append($mainRow);
    }
  };

  const createCard = function(item) {
    $('#title').val('');
    $('#item-description').val('');
    $('#img-file').val('');

    const { title, id } = item;
    const imgPath = item.image_path;

    const $cardColDiv = $('<div>').addClass('col s6 m3 items-card');
    const $cardDiv = $('<div>').addClass('card');
    const $cardImgDiv = $('<div>').addClass('card-image');
    const $cardImg = $('<img>').attr('alt', 'filler').attr('src', `./images/${imgPath}`);
    const $cardContent = $('<div>').addClass('card-content');
    const $titleP = $('<p>').text(title);
    const $cardActionDiv = $('<div>').addClass('card-action');
    const $cardActionAnchor = $('<a>').attr('href', '#modal1');
    const $cardIconSpan = $('<span>').addClass('destroy');
    const $cardIcon = $('<i>').addClass('clear material-icons fav-icon medium red-text').attr('id', id).text('clear');

    $cardIconSpan.append($cardIcon);
    $cardActionAnchor.append($cardIconSpan);

    $cardImgDiv.append($cardImg);
    $cardContent.append($titleP);
    $cardActionDiv.append($cardActionAnchor);

    $cardDiv.append($cardImgDiv).append($cardContent).append($cardActionDiv);
    $cardColDiv.append($cardDiv);
    $('#items').append($cardColDiv);
  };

  const renderItems = function() {
    const itemsListed = {
      contentType: 'application/json',
      dataType: 'json',
      type: 'GET',
      url: '/dashboard'
    };

    $.ajax(itemsListed)
    .done((items) => {
      if (!items.length) {
        const $noItems = $('<p>').addClass('flow-text no-items blue-grey-text text-lighten-4').text('You are not sharing any items at this time');

        $('#items').append($noItems);
      }
      for (const item of items) {
        createCard(item);
      }
    })
    .fail(($xhr) => {
      console.log($xhr.responseText);
      Materialize.toast($xhr.responseText, 3000);
    });
  };

  let userName;
  let email;

  // GET CURRENT USER INFO
  const tokenOptions = {
    contentType: 'application/json',
    dataType: 'json',
    type: 'GET',
    url: `/token`
  };

  $.ajax(tokenOptions)
    .done((userId) => {
      $.ajax(`/users/${userId.userId}`)
        .done((user) => {
          userName = user.name;
          email = user.email;

          $('#user-name').text(`Name: ${userName}`);
          $('#user-email').text(`Email: ${email}`);
          $('#user-items-borrowing').text('Items Borrowing: NOTHING YET')
        })
        .fail(($xhr) => {
          console.log($xhr.responseText);
          Materialize.toast($xhr.responseText, 3000);
        });

      $.ajax(`/fav_items/${userId.userId}`)
        .done((favorites) => {
          console.log(favorites, favorites.length);
          if (!favorites.length) {
            const $noFavs = $('<p>').addClass('flow-text no-items blue-grey-text text-lighten-4').text('You have not favorited any items yet');

            $('#favorites').append($noFavs);
          }

          for (const fav of favorites) {
            // createCard(fav);
          }
        })
        .fail(($xhr) => {
          console.log($xhr.responseText);
          Materialize.toast($xhr.responseText, 3000);
        });

        // GET REQUEST
        $.ajax(`/requests/${userId.userId}`)
          .done((requests) => {
            if (!requests.length) {
              // $('#requests').empty();
              const $noRequests = $('<p>').addClass('flow-text no-items blue-grey-text text-lighten-4').text('You have no pending requests at this time');

              $('#requests').append($noRequests);
            }
            renderRequests(requests);
          })
          .fail(($xhr) => {
            console.log($xhr.responseText);
            Materialize.toast($xhr.responseText, 3000);
          });
    })
    .fail(($xhr) => {
      console.log($xhr.responseText);
      Materialize.toast($xhr.responseText, 3000);
    });

  renderItems();

  let itemId;

  $('#items').on('click', 'i.clear', (event) => {
    itemId = $(event.target)[0].id;

    $.ajax(`/items/${itemId}`)
      .done((itemToDelete) => {
        const title = itemToDelete.title;

        $('.item-title').empty();
        $('.item-title').append(`Title: ${title}`);
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
  });

  $('.delete').click(() => {
    const item = {
      contentType: 'application/json',
      dataType: 'json',
      type: 'DELETE',
      url: `/items/${itemId}`
    };

    $.ajax(item)
      .done(() => {
        $('#items').empty();
        renderItems();
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
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
      .done((addedItem) => {
        $('.no-items').remove();
        createCard(addedItem);
      })
      .fail(($xhr) => {
        console.log($xhr.responseText);
        Materialize.toast($xhr.responseText, 3000);
      });
  });

  $('#requests').on('click', 'i', (event) => {
    const itemToDelete = $(event.target).attr('item-id');

    const deleteReqItem = {
      contentType: 'application/json',
      dataType: 'json',
      type: 'DELETE',
      url: `/requests/${itemToDelete}`
    };

    const deleteItem = {
      contentType: 'application/json',
      dataType: 'json',
      type: 'DELETE',
      url: `/items/${itemToDelete}`
    };

    $.when(
      $.ajax(deleteReqItem),
      $.ajax(deleteItem)
    )
    .done((reqDeleted, itemDeleted) => {
      $('#requests').addClass('active');
      if ($(event.target).hasClass('decline')) {
        Materialize.toast(`Decline email sent for item number: ${itemToDelete}`);
      } else {
        Materialize.toast(`Mutual agreement email sent for item number: ${itemToDelete}`);
      }
      window.location.reload();
    })
    .fail(($xhr) => {
      console.log($xhr.responseText);
      Materialize.toast($xhr.responseText, 3000);
    });
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
