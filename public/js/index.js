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

  const verifyForm = function(name, email, password) {
    if (!name) {
      return 'Name must not be blank';
    }
    else if (!email) {
      return 'Email must not be blank';
    }
    else if (email.indexOf('@') < 0) {
      return 'Email must be valid';
    }
    else if (!password || password.length < 8) {
      return 'Password must be at least 8 character long';
    }

    return 'OKAY';
  };

  $('#new-user-submit').submit((event) => {
    event.preventDefault();

    const newName = $('#name').val().trim();
    const newEmail = $('#new-email').val().trim();
    const newPassword = $('#new-password').val().trim();

    const result = verifyForm(newName, newEmail, newPassword);

    if (result === 'OKAY') {
      const newUser = {
        contentType: 'application/json',
        data: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword
        }),
        dataType: 'json',
        type: 'POST',
        url: '/users'
      };

      $.ajax(newUser)
        .done(() => {
          $('#modal2').modal('open');
        })
        .fail(($xhr) => {
          Materialize.toast($xhr.responseText, 3000);
        });
    }
    else {
      return Materialize.toast(result, 3000);
    }
  });

  $('#new-item-submit').submit((event) => {
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

    const initialItem = {
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

    $.ajax(initialItem)
      .done(() => {
        window.location.href = '/items.html';
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
  });

  $('#returning-user').submit((event) => {
    event.preventDefault();

    const email = $('#email').val().trim();
    const password = $('#password').val().trim();

    if (!email) {
      return Materialize.toast('Email must not be blank', 3000);
    }
    if (!password || password.length < 8) {
      return Materialize.toast('Password must be valid', 3000);
    }

    const returningUser = {
      contentType: 'application/json',
      data: JSON.stringify({
        email,
        password
      }),
      dataType: 'json',
      type: 'POST',
      url: '/token'
    };

    $.ajax(returningUser)
      .done(() => {
        window.location.href = '/items.html';
      })
      .fail(($xhr) => {
        console.log($xhr.responseText);
        Materialize.toast($xhr.responseText, 3000);
      });
  });
})();
