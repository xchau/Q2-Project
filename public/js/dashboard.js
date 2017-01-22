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

  // DASHBOARD GLOBAL VARIABLE
  let userName;
  let email;
  let itemId;
  let currentId;

  // RENDER ITEMS REQUESTED FOR LENDING
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

  // CREATE INDIVIDUAL CARDS
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

    const { id, imagePath } = item;
    const $cardColDiv = $('<div>').addClass('col s6 m3 items-card');
    const $cardDiv = $('<div>').addClass('card');
    const $cardImgDiv = $('<div>').addClass('card-image');
    const $cardImg = $('<img>').attr('alt', 'filler').attr('src', `./images/${imagePath}`);
    const $cardActionDiv = $('<div>').addClass('card-action');
    const $cardActionAnchor = $('<a>').attr('href', hasModal);
    const $cardIconSpan = $('<span>').addClass('destroy');
    const $cardIcon = $('<i>').addClass(`${icon} material-icons fav-icon medium ${iconColor} ${isFav}`).attr('id', id).text(icon);

    $cardIconSpan.append($cardIcon);
    $cardActionAnchor.append($cardIconSpan);

    $cardImgDiv.append($cardImg);
    $cardActionDiv.append($cardActionAnchor);

    $cardDiv.append($cardImgDiv).append($cardActionDiv);
    $cardColDiv.append($cardDiv);
    $(appendTo).append($cardColDiv);
  };

  // DISPLAY ALL USER ITEM IN DATABASE TO ITEMS TAB
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
      } else {
        $('#items').empty();
        for (const item of items) {
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

  // GET CURRENT USER INFO
  const tokenOptions = {
    contentType: 'application/json',
    dataType: 'json',
    type: 'GET',
    url: `/token`
  };

  $.ajax(tokenOptions)
    .done((userId) => {
      currentId = userId.userId;
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
          if (!favorites.length) {
            const $noFavs = $('<p>').addClass('flow-text no-items blue-grey-text text-lighten-4').text('You have not favorited any items yet');

            $('#favorites').append($noFavs);
          } else {
            $('#favorites').empty();
            for (const fav of favorites) {
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

          $.ajax(`/users/${currentId}`)
            .done((user) => {
              $('#sidepro')
                .css('background', `url(../images/${user.user_image_path})`)
                .css('background-size', 'cover');
              $('#image-holder')
                .css('background', `url(../images/${user.user_image_path})`)
                .css('background-size', 'cover');
              $('#profile-image').val('');
            })
            .fail((err) => {
              Materialize.toast(err.responseText, 3000);
            });
    })
    .fail(($xhr) => {
      console.log($xhr.responseText);
      Materialize.toast($xhr.responseText, 3000);
    });

 // TRIGGER TO OPEN DELETE ITEM MODAL
  $('#items').on('click', 'i.clear', (event) => {
    let routePath;
    itemId = $(event.target).attr('id');
    if ($('i.clear').hasClass('false')) {
      routePath = `/items/${itemId}`;
    } else {
      routePath = `/fav_items/${itemId}`;
    }
    $.ajax(routePath)
      .done((itemToDelete) => {
        const title = itemToDelete.title;
        if (title) {
          $('#delete-item').empty();
          $('#delete-item').append(`Are you sure you want to delete your ${title.toLowerCase()}?`);
        }
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
  });

  // DELETE CONFIRMATION IN ITEMS MODAL
  $('.delete').on('click', () => {
    const item = {
      contentType: 'application/json',
      data: JSON.stringify({ isDeleteItem: true }),
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

  $('#favorites').on('click', 'i.fav-icon', (event) => {
    itemId = $(event.target)[0].id;
    const options = {
      contentType: 'application/json',
      dataType: 'json',
      type: 'DELETE',
      url: `/fav_items/${itemId}`
    };

    $.ajax(options)
      .done(() => {

      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
  });

  $('#add-item').submit((event) => {
    event.preventDefault();

    const title = $('#title').val().trim().charAt(0).toUpperCase() + $('#title').val().trim().slice(1);
    const itemDescription = $('#item-description').val().trim();
    const imgFile = $('#img-file').val().trim();

    if (title && itemDescription && imgFile) {
      $('#insert-item').addClass('modal-close');
    } else {
      if (!title) {
        Materialize.toast('Title must not be blank', 3000);
      }

      if (!itemDescription) {
        return Materialize.toast('Item description must not be blank', 3000);
      }

      if (!imgFile) {
        return Materialize.toast('Image file must not be blank', 3000);
      }
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
        console.log(addedItem);
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
        itemDeleted.emailText = `Sorry, ${itemDeleted.borrowName}, but ${itemDeleted.itemName} is no longer available. Try searching again.\n\nCheers,\n\nThe LENDit Team`;
      } else {
        Materialize.toast(`Mutual agreement email sent for item number: ${itemToDelete}`);
        itemDeleted.emailText = `Yay! ${itemDeleted.ownerName} has agreed to let you borrow the ${itemDeleted.itemName}! \n\nCheers,\n\nThe LENDit Team`;
      }
      const options = {
        contentType: 'application/json',
        data: JSON.stringify(itemDeleted),
        dataType: 'json',
        type: 'POST',
        url: '/email'
      };

      $.ajax(options)
        .done(() => {
          Materialize.toast('Confirmation email has been sent', 5000);
          window.location.reload();
        })
        .fail(($xhr) => {
          Materialize.toast($xhr.responseText, 7000, '', () => {
            window.location.reload();
          });
          window.location.reload();
        });
    })
    .fail(($xhr) => {
      Materialize.toast($xhr.responseText, 3000, '', () => {
        window.location.reload();
      });
    });
  });

  $('#update-image').on('click', (event) => {
    event.preventDefault();
    const imagePath = $('#profile-image').val().trim();
    console.log(imagePath);
    if (!imagePath) {
      Materialize.toast('Invalid file path', 3000);
    } else {
      const userOptions = {
        contentType: 'application/json',
        data: JSON.stringify({ userImagePath: imagePath }),
        dataType: 'json',
        type: 'PATCH',
        url: `/users/${currentId}`
      };

      $.ajax(userOptions)
      .done((users) => {
        $('#sidepro')
          .css('background', `url(../images/${users.userImagePath})`)
          .css('background-size', 'cover');
        $('#image-holder')
          .css('background', `url(../images/${users.userImagePath})`)
          .css('background-size', 'cover');
        $('#profile-image').val('');
      })
      .fail(($xhr) => {
        console.log($xhr.responseText);
        Materialize.toast($xhr.responseText, 3000);
      });
    }

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
