'use strict';

exports.seed = function(knex) {
  return knex('comments').del()
    .then(() => {
      return knex('comments').insert([{
        id: 1,
        item_id: 1,
        users_id: 1,
        comment: 'this is an amazing item!',
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 2,
        item_id: 2,
        users_id: 2,
        comment: 'this is the best item ever!',
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 2,
        item_id: 2,
        users_id: 2,
        comment: 'this is the best item ever!',
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
       "SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments));"
     );
   });
};
