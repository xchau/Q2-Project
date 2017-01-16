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

  // RENDER MODAL FUNCTION //
  const renderModal = function(modalId, itemName, itemDesc) {
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
    const $favSpan = $('<span>');
    const $star = $('<i>')
      .addClass('material-icons modal-icon waves-effect')
      .text('stars');

    $star.appendTo($favSpan);

    const $comSpan = $('<span>');
    const $com = $('<i>')
      .addClass('material-icons modal-icon waves-effect')
      .text('comment');

    $com.appendTo($comSpan);
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
  const imgSrc = './images/book.jpg';
  const lenderName = 'Lender Name';
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
        .attr('src', imgSrc);

      $img.appendTo($cardImage);
      $cardImage.appendTo($card);

      const $cardContent = $('<div>')
        .addClass('card-content');
      const $iName = $('<p>')
        .text(element.title);
      const $fromLender = $('<p>')
        .text(`From: ${lenderName}`);

      $iName.appendTo($cardContent);
      $fromLender.appendTo($cardContent);
      $cardContent.appendTo($card);

      const $cardAction = $('<div>')
        .addClass('card-action');
      const $moreInfo = $('<a>')
        .attr('href', `#modal${itemCount}`)
        .addClass('moreInfo')
        .text('More Info');

      $moreInfo.appendTo($cardAction);
      $cardAction.appendTo($card);
      $card.appendTo($itemCard);
      $itemCard.appendTo('#listings');

      renderModal(itemCount, element.title, element.description);
    }

    $('.modal').modal();
  };

  // INITIAL AJAX CALL TO RENDER SCREEN //
  $.ajax('/items')
    .done((items) => {
      console.log(items);
      renderCards(items);
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
        console.log(items);
      })
      .fail((err) => {
        Materialize.toast(err.responseText, 3000);
      });
  });
})();
