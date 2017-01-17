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
      .addClass('comments-sections');

    $comSection.appendTo($comModal);
    $comModal.appendTo('#listings');

      // for each comment in data
  };

  // RENDER ITEM MODAL FUNCTION //
  const renderModal = function(modalId, itemName, itemDesc, lenderName) {
    const $infoModal = $('<div>')
      .prop('id', `modal${modalId}`)
      .addClass('modal');
    const $modalContent = $('<div>')
      .addClass('modal-content center-align');
    const $itemName = $('<h5>')
      .text(itemName);
    const $hr = $('<hr>');

    $itemName.appendTo($modalContent);
    $hr.appendTo($modalContent);

    const $iconRow = $('<div>')
      .addClass('icon-row');
    const $favSpan = $('<span>')
      .addClass('icon-span');
    const $star = $('<i>')
      .addClass('material-icons modal-icon star')
      .text('star');

    $star.appendTo($favSpan);

    const $comSpan = $('<span>')
      .addClass('icon-span');
    const $comLink = $('<a>')
      .attr('href', `#com${modalId}`);
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
      .text(itemDesc);
    const $offerBy = $('<p>')
      .addClass('left-align')
      .html(`<em>Offered by: ${lenderName}</em>`);

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

  // RENDER CARDS FUNCTION //
  let itemCount = 0;

  const renderCards = function(data) {
    for (const element of data) {
      itemCount += 1;

      const $itemCard = $('<div>')
        .addClass('col s6 m3 item-card');
      const $card = $('<div>')
        .addClass('card');
      const $cardImage = $('<div>')
        .addClass('card-image');
      const $img = $('<img>')
        .attr('alt', element.title)
        .attr('src', `images/${element.imagePath}`)

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
      const $moreInfo = $('<a>')
        .attr('href', `#modal${itemCount}`)
        .attr('alt', element.id)
        .addClass('more-info')
        .text('More Info');

      $moreInfo.appendTo($cardAction);
      $cardAction.appendTo($card);
      $card.appendTo($itemCard);
      $itemCard.appendTo('#listings');

      renderModal(itemCount, element.title, element.description, element.name);
      renderComModal(itemCount, element.title, element.name);
    }

    $('.modal').modal();
  };

  // APPLY jQUERY EVENTS TO RENDERED ELEMS //
  const applyEvents = function() {
    $('.star').on({
      'click': function() {
        $('.star').toggleClass('yellow-text');
      },
      'mouseover': function() {
        $('.star').parent().css('cursor', 'pointer');
      }
    });
  }

  // RENDER COMMENT CARD //
  

  // COMMENT EVENT + AJAX TO COMMENTS TABLE //
  const callComments = function() {
    $('.more-info').on('click', (event) => {
      const $target = $(event.target);
      const itemId = $target.attr('alt');

      console.log($target);
      console.log(`/comments/${itemId}`);

      const options = {
        contentType: 'application/json',
        dataType: 'json',
        type: 'GET',
        url: `/comments/${itemId}`
      };

      $.ajax(options)
        .done((comments) => {
          console.log(comments);
        })
        .fail(() => {
          // fill comments modal w/ default pic
          console.log('There was an error');
        });
    });
  };

  // INITIAL AJAX CALL TO RENDER SCREEN //
  $.ajax('/items')
    .done((items) => {
      // console.log(items);
      renderCards(items);
      applyEvents();
      callComments();
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
    };

    $.ajax(options)
      .done((items) => {
        $('#listings').empty();

        renderCards(items);
        applyEvents();
      })
      .fail((err) => {
        Materialize.toast(err.responseText, 3000);
      });
  });
})();
