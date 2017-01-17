'use strict';

exports.seed = function(knex) {
  return knex('items').del()
    .then(() => {
      return knex('items').insert([{
        id: 1,
        user_id: 1,
        title: 'lawnmower',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image_path: 'tools.jpg',
        requested_at: null,
        borrowed_at: null,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 2,
        user_id: 2,
        title: 'hammer',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image_path: 'tools.jpg',
        requested_at: null,
        borrowed_at: null,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
       "SELECT setval('items_id_seq', (SELECT MAX(id) FROM items));"
     );
   });
};
