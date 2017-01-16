(function() {
  'use strict';

  $(document).ready(function() {
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
    else {
      return 'OKAY';
    }
  };

  $('#new-user-submit').submit(function(event) {
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
          $('#new-user-submit').attr('data-target', 'modal2');
        })
        .fail(($xhr) => {
          Materialize.toast($xhr.responseText, 3000);
        });
    }
    else {
      Materialize.toast(result, 3000);
    }


  });
})();



// make a request to server.js
// server.js has users route send to that path
