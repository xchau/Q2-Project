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
      const $declineIcon = $('<i>').addClass('reqIcon decline material-icons small red-text').attr('item-id', reqItemId).text('clear');
      const $acceptDiv = $('<div>').addClass('col s2 center');
      const $acceptIcon = $('<i>').addClass('reqIcon accept material-icons small green-text').attr('item-id', reqItemId).text('done');

      $declineDiv.append($declineIcon);
      $acceptDiv.append($acceptIcon);
      $mainRow.append($titleDiv).append($borrowRow).append($declineDiv).append($acceptDiv);

      $('#requests').append($mainRow);
    }
  };

  const createCard = function(item, isFav) {
    $('#title').val('');
    $('#item-description').val('');
    $('#img-file').val('');

    let appendTo;
    let icon;
    let iconColor;
    let hasModal;

    if (isFav) {
      appendTo = '#favorites';
      icon = 'star'
      iconColor = 'yellow-text'
      hasModal = '';

    } else {
      appendTo = '#items'
      icon = 'clear'
      iconColor = 'red-text'
      hasModal = '#modal1';
    }
    console.log('This item: ', item, 'Is Fav?', isFav);
    const { id, imagePath } = item;
    // const imgPath = item.image_path;

    const $cardColDiv = $('<div>').addClass('col s6 m3 items-card');
    const $cardDiv = $('<div>').addClass('card');
    const $cardImgDiv = $('<div>').addClass('card-image');
    const $cardImg = $('<img>').attr('alt', 'filler').attr('src', `./images/${imagePath}`);
    const $cardActionDiv = $('<div>').addClass('card-action');
    const $cardActionAnchor = $('<a>').attr('href', hasModal);
    const $cardIconSpan = $('<span>').addClass('destroy');
    const $cardIcon = $('<i>').addClass(`material-icons fav-icon medium ${iconColor} ${isFav}`).attr('id', id).text(icon);

    $cardIconSpan.append($cardIcon);
    $cardActionAnchor.append($cardIconSpan);

    $cardImgDiv.append($cardImg);
    $cardActionDiv.append($cardActionAnchor);

    $cardDiv.append($cardImgDiv).append($cardActionDiv);
    $cardColDiv.append($cardDiv);
    $(appendTo).append($cardColDiv);
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
      console.log('Items: ', items, items.length);
      if (!items.length) {
        const $noItems = $('<p>').addClass('flow-text no-items blue-grey-text text-lighten-4').text('You are not sharing any items at this time');

        $('#items').append($noItems);
      } else {
        $('#items').empty();
        for (const item of items) {
          console.log('Item: ', item);
          createCard(item, false);
        }
      }
    })
    .fail(($xhr) => {
      console.log($xhr.responseText);
      Materialize.toast($xhr.responseText, 3000);
    });
  };
  renderItems();

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

          $('#sidepro')
            .css('background', `url(../images/${user.user_image_path})`)
            .css('background-size', 'cover');

          $('#user-name').text(`Name: ${userName}`);
          $('#user-email').text(`Email: ${email}`);
          // $('#user-items-borrowing').text('Items Borrowing: NOTHING YET')
        })
        .fail(($xhr) => {
          console.log($xhr.responseText);
          Materialize.toast($xhr.responseText, 3000);
        });

      // GET FAVORTIES
      $.ajax(`/fav_items/${userId.userId}`)
        .done((favorites) => {
          console.log('favorites:', favorites, favorites.length);
          if (!favorites.length) {
            const $noFavs = $('<p>').addClass('flow-text no-items blue-grey-text text-lighten-4').text('You have not favorited any items yet');

            $('#favorites').append($noFavs);
          } else {
            $('#favorites').empty();
            for (const fav of favorites) {
              console.log('One Favorite: ', fav);
              createCard(fav, true);
            }
          }

        })
        .fail(($xhr) => {
          console.log($xhr.responseText);
          Materialize.toast($xhr.responseText, 3000);
        });

        // GET REQUEST
        $.ajax(`/requests/${userId.userId}`)
          .done((requests) => {
            console.log('Requests', requests, requests.length);
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

  let itemId;

  $('#items').on('click', 'i.clear', (event) => {
    let routePath;
    itemId = $(event.target)[0].id;
    if ($('i.clear').attr('id') === '#modal1') {
      routePath = `/items/${itemId}`;
    } else {
      routePath = `/fav_items/${itemId}`;
    }

    $.ajax(routePath)
      .done((itemToDelete) => {
        const title = itemToDelete.title;
        console.log(routePath, itemToDelete);
        $('.item-title').empty();
        $('.item-title').append(`Title: ${title}`);
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
  });

  $('#favorites').on('click', 'i.fav-icon', (event) => {
    // event.preventDefault();
    itemId = $(event.target)[0].id;
    console.log('Testing', $(event.target)[0].id);
    const options = {
      contentType: 'application/json',
      dataType: 'json',
      type: 'DELETE',
      url: `/fav_items/${itemId}`
    };

    $.ajax(options)
      .done(() => {
        // const title = itemToDelete.title;

        // $('.item-title').empty();
        // $('.item-title').append(`Title: ${title}`);
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
        console.log('TESTING in .delete');
        $('#items').empty();
        renderItems();
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
  });

  $('#add-item').submit((event) => {
    event.preventDefault();

    const title = $('#title').val().trim().charAt(0).toUpperCase() + $('#title').val().trim().slice(1);
    console.log(title);
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
        console.log('These: ', addedItem);
        $('.no-items').remove();
        console.log("Debbie", addedItem);
        createCard(addedItem, false);
      })
      .fail(($xhr) => {
        console.log($xhr.responseText);
        Materialize.toast($xhr.responseText, 3000);
      });
  });

  $('#requests').on('click', 'i', (event) => {
    event.preventDefault();
    const itemToDelete = $(event.target).attr('item-id');

    const deleteItem = {
      contentType: 'application/json',
      dataType: 'json',
      type: 'DELETE',
      url: `/items/${itemToDelete}`
    };

    $.when(
      $.ajax(deleteItem)
    )
    .done((itemDeleted) => {
      $('#requests').addClass('active');

      if ($(event.target).hasClass('decline')) {
        Materialize.toast(`Decline email sent for item number: ${itemToDelete}`);
        itemDeleted.emailText = `Sorry, ${itemDeleted.borrowName}, but ${itemDeleted.itemName} is no longer available. Try searching again.\n\nCheers,\n\nThe NearBuy Team`;
      } else {
        Materialize.toast(`Mutual agreement email sent for item number: ${itemToDelete}`);
        itemDeleted.emailText = `Yay! ${itemDeleted.ownerName} has agreed to let you borrow the ${itemDeleted.itemName}! \n\nCheers,\n\nThe NearBuy Team`;
      }
      const options = {
        contentType: 'application/json',
        data: JSON.stringify(itemDeleted),
        dataType: 'json',
        type: 'POST',
        url: '/test'
      };
      $.ajax(options)
        .done(() => {
          Materialize.toast('Confirmations email has been sent', 3000);
        })
        .fail(($xhr) => {
          console.log($xhr.responseText);
          Materialize.toast($xhr.responseText, 3000);
        });
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
