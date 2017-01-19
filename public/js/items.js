(function() {
  'use strict';

  // MATERIALIZE INITIALIZATION //
  $('.button-collapse').sideNav({
    menuWidth: 250,
    edge: 'right',
    closeOnClick: true
  });

  $('.modal').modal({
    dismissible: true,
    opacity: 0.5
  });

  $('.user-request').on('click', () => {
    Materialize.toast('Request has been sent!', 4000);
  });

  // "GLOBAL" VARIABLES //
  let userClaim;

  // RENDER COMMENT MODAL FUNCTION //
  const renderComModal = function(modalId, itemName, lenderName) {
    const $comModal = $('<div>')
      .prop('id', `com${modalId}`)
      .addClass('modal com-modal');
    const $modalContent = $('<div>')
      .addClass('modal-content center-align');
    const $title = $('<h5>')
      .addClass('center-align')
      .text(`${lenderName}'s ${itemName}`);
    const $hr = $('<hr>');

    $title.appendTo($modalContent);
    $hr.appendTo($modalContent);
    $modalContent.appendTo($comModal);

    const $comSection = $('<div>')
      .addClass('comments-section container');

    $comSection.appendTo($comModal);
    $comModal.appendTo('#listings');
  };

  // RENDER ITEM MODAL FUNCTION //
  const renderModal = function(itemObject) {
    const $infoModal = $('<div>')
      .prop('id', `modal${itemObject.id}`)
      .addClass('modal');
    const $modalContent = $('<div>')
      .addClass('modal-content center-align');
    const $itemName = $('<h5>')
      .text(`${itemObject.name}'s ${itemObject.title}`);
    const $hr = $('<hr>');

    $itemName.appendTo($modalContent);
    $hr.appendTo($modalContent);

    const $iconRow = $('<div>')
      .addClass('icon-row');
    const $favSpan = $('<span>')
      .addClass('icon-span');
    const $star = $('<i>')
      .addClass(`material-icons modal-icon star star${itemObject.id}`)
      .attr('alt', `${itemObject.id}`)
      .attr('data-own', `${itemObject.ownerId}`)
      .text('star');

    $star.appendTo($favSpan);

    const $comSpan = $('<span>')
      .addClass('icon-span');
    const $comLink = $('<a>')
      .attr('href', `#com${itemObject.id}`);
    const $com = $('<i>')
      .addClass('material-icons modal-icon com-icon')
      .text('comment');

    $com.appendTo($comLink);
    $comLink.appendTo($comSpan);
    $favSpan.appendTo($iconRow);
    $comSpan.appendTo($iconRow);
    $iconRow.appendTo($modalContent);

    const $desc = $('<p>')
      .addClass('left-align')
      .text(itemObject.description);
    const $offerBy = $('<p>')
      .addClass('left-align')
      .html(`<em>Offered by: ${itemObject.name}</em>`);

    $desc.appendTo($modalContent);
    $offerBy.appendTo($modalContent);

    const $modalFooter = $('<div>')
      .addClass('modal-footer left');
    const $request = $('<a>')
      .attr('href', '#!')
      .addClass('modal-action modal-close waves-effect waves-green btn user-request')
      .text('Request');

    $request.appendTo($modalFooter);
    $modalFooter.appendTo($modalContent);
    $modalContent.appendTo($infoModal);
    $infoModal.appendTo('#listings');
  };

  // ACTIVATE REQUEST BUTTON //
  const patchInsertRequest = function(borrowId, ownerId, itemId, itemTitle) {
    const itemOptions = {
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        itemId: Number.parseInt(itemId)
      }),
      type: 'PATCH',
      url: '/items'
    };

    const requestInsert = {
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        borrowId: Number.parseInt(borrowId),
        userId: Number.parseInt(ownerId),
        itemId: Number.parseInt(itemId)
      }),
      type: 'POST',
      url: '/requests'
    };

    $.when(
      $.ajax(itemOptions),
      $.ajax(requestInsert)
    )
    .done((requestState, insertedRequest) => {
      // SEND EMAIL HERE //

      Materialize.toast(`Email request sent for ${itemTitle}`, 1500, '', () => {
        window.location.reload();
      });
    })
    .fail((err) => {
      Materialize.toast('hello');
    });
  };

  const handleRequest = function() {
    $('.user-request').on('click', (event) => {
      const $target = $(event.target);

      const itemId = $target.parent().parents().children('div').children().children().attr('alt');
      const ownerId = $target.parent().parents().children('div').children().children().attr('data-own');
      console.log(ownerId);
      const itemTitle = $target.parent().parent().children().first().text();

      console.log($target.parent().parents().children('div').children().children().get(0));

      $.ajax('/token')
        .done((claim) => {
          console.log(claim);
          patchInsertRequest(claim.userId, ownerId, itemId, itemTitle);
        })
        .fail((err) => {
          Materialize.toast(err.responseText, 3000);
        });
    });
  };

  // APPLY jQUERY EVENTS TO RENDERED ELEMS //
  const applyEvents = function() {
    $('.star').on({
      'click': function(event) {
        const $target = $(event.target);
        const itemId = $target.attr('alt');

        if ($('.star').attr('data-internalid') === 'true') {
          $('.star').toggleClass('yellow-text');

          $('.star').attr('data-internalid', 'false');

          console.log('delete fav');
        }
        else {
          $('.star').toggleClass('yellow-text');

          $('.star').attr('data-internalid', 'true');

          console.log('add fav');
        }
      },
      'mouseover': function() {
        $('.star').parent().css('cursor', 'pointer');
      }
    });

    $.ajax('/fav_items')
      .done((favItems) => {
        // console.log(favItems);
        checkFav(favItems);
      })
      .fail((err) => {
        Materialize.toast(err.responseText, 3000);
      });
  };

  // RENDER COMMENT CARD //
  const renderComments = function(data, target) {
    const itemId = target.attr('alt');
    const $comDiv = $(`#com${itemId} div:nth-child(2)`);

    if (data.length) {
      for (const element of data) {
        const $comBox = $('<div>')
        .addClass('comment-box');
        const $proBox = $('<div>')
        .addClass('profile-box');
        const $proPic = $('<div>')
        .css('background', 'url(../images/book.jpg)')
        .css('background-size', 'cover')
        .css('border-radius', '50%')
        .css('height', '40px')
        .css('width', '40px');
        const $nameSpan = $('<span>')
        .text(element.name);

        $proPic.appendTo($proBox);
        $nameSpan.appendTo($proBox);
        $proBox.appendTo($comBox);

        const $textBox = $('<div>')
        .addClass('text-box');
        const $itemDesc = $('<p>')
        .addClass('text')
        .text(element.comment);

        $itemDesc.appendTo($textBox);
        $textBox.appendTo($comBox);
        $comBox.appendTo($comDiv);
      }
    }
    else {
      const $noCom = $('<div>')
        .addClass('no-comments center-align');
      const $noText = $('<p>')
        .addClass('no-text')
        .text('No comments are available for this item');

      $noText.appendTo($noCom);
      $noCom.appendTo($comDiv);
    }
  };

  // COMMENT EVENT + AJAX TO COMMENTS TABLE //
  const callComments = function() {
    $('.more-info').on('click', (event) => {
      const $target = $(event.target);
      const itemId = $target.attr('alt');

      const options = {
        contentType: 'application/json',
        dataType: 'json',
        type: 'GET',
        url: `/comments/${itemId}`
      };

      $.ajax(options)
        .done((comments) => {
          renderComments(comments, $target);
        })
        .fail((err) => {
          Materialize.toast(err.responseText, 3000);
        });
    });
  };

  // RENDER CARDS FUNCTION //
  const renderCards = function(data) {
    $.ajax('/token')
      .done((claim) => {
        userClaim = claim.userId;

        for (const element of data) {
          const $itemCard = $('<div>')
            .addClass('col s6 m3 item-card');
          const $card = $('<div>')
            .addClass('card');
          const $cardImage = $('<div>')
            .addClass('card-image');
          const $img = $('<img>')
            .attr('alt', element.title)
            .attr('src', `images/${element.imagePath}`);

          $img.appendTo($cardImage);
          $cardImage.appendTo($card);

          const $cardContent = $('<div>')
            .addClass('card-content');
          const $iName = $('<p>')
            .text(element.title);
          const $fromLender = $('<p>')
            .text(`From: ${element.name}`);

          $iName.appendTo($cardContent);
          $fromLender.appendTo($cardContent);
          $cardContent.appendTo($card);

          const $cardAction = $('<div>')
            .addClass('card-action');

          if (element.ownerId === userClaim) {
            const $moreInfo = $('<a>')
              .addClass('your-thing')
              .text(`Your ${element.title}`);

            $moreInfo.appendTo($cardAction);
          }
          else {
            const $moreInfo = $('<a>')
              .attr('href', `#modal${element.id}`)
              .attr('alt', element.id)
              .addClass('more-info')
              .text('More Info');

            $moreInfo.appendTo($cardAction);
          }

          $cardAction.appendTo($card);
          $card.appendTo($itemCard);
          $itemCard.appendTo('#listings');

          renderModal(element);
          renderComModal(element.id, element.title, element.name);
        }

        $('.modal').modal();

        handleRequest();
        applyEvents();
        callComments();
      })
      .fail((err) => {
        Materialize.toast(err.responseText, 3000);
      });
  };

  // CHECK IF ITEM IS FAVORITED //
  const checkFav = function(data) {
    for (const element of data) {
      if (element.favAt) {
        $(`.star${element.itemId}`)
          .addClass('yellow-text')
          .attr('data-internalid', 'true');
      }
      else {
        $(`.star${element.itemId}`)
          .removeClass('yellow-text')
          .attr('data-internalid', 'false');
      }
    }
  };

  // FILTER ONLY AVAILABLE ITEMS //
  let availableItems = [];

  const filterItems = function(data) {
    for (const item of data) {
      if (!item.requestedAt) {
        availableItems.push(item);
      }
    }
  };

  // INITIAL AJAX CALL TO RENDER SCREEN //
  $.ajax('/items')
    .done((items) => {
      filterItems(items);
      renderCards(availableItems);
    })
    .fail(() => {
      Materialize.toast('Oops! Unable to retrieve listings.', 3000);
    });

  // GRAB USER KEYWORD & MAKE AJAX CALL //
  let keyword;

  $('#submit').on('click', (event) => {
    event.preventDefault();
    availableItems = [];

    keyword = $('#search-bar').val().trim();

    const options = {
      contentType: 'application/json',
      type: 'GET',
      url: `/items/search?q=${keyword}`
    };

    $.ajax(options)
      .done((items) => {
        $('#listings').empty();
        filterItems(items);
        renderCards(availableItems);
      })
      .fail((err) => {
        Materialize.toast(err.responseText, 3000);
      });
  });
})();
