'use strict';

exports.seed = function(knex) {
  return knex('fav_items').del()
    .then(() => {
      return knex('fav_items').insert([{
        id: 1,
        item_id: 1,
        user_id: 1,
        user_fav_id: 2,
        fav_at: null,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 2,
        item_id: 3,
        user_id: 1,
        user_fav_id: 2,
        fav_at: null,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
       "SELECT setval('fav_items_id_seq', (SELECT MAX(id) FROM fav_items));"
     );
    });
};
