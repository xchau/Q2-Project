'use strict';

exports.seed = function(knex) {
  return knex('comments').del()
    .then(() => {
      return knex('comments').insert([{
        id: 1,
        item_id: 1,
        user_id: 1,
        comment: 'this is an amazing item!'
      }, {
        id: 2,
        item_id: 2,
        user_id: 2,
        comment: 'this is the best item ever!'
      }, {
        id: 3,
        item_id: 2,
        user_id: 1,
        comment: 'AAAHHHHHHHHH!'
      }, {
        id: 4,
        item_id: 1,
        user_id: 2,
        comment: '#@*($&(#*&$(#@&$(*&!!!))))'
      }, {
        id: 5,
        item_id: 1,
        user_id: 1,
        comment: 'Sooooooooooooo GOOOOOD'
      }, {
        id: 6,
        item_id: 2,
        user_id: 2,
        comment: 'I make $5000/wk from home. FIND OUT HOW: http://www.getrich.com'
      }]);
    })
    .then(() => {
      return knex.raw(
       "SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments));"
     );
    });
};
