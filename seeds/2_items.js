'use strict';

exports.seed = function(knex) {
  return knex('items').del()
    .then(() => {
      return knex('items').insert([{
        id: 1,
        user_id: 2,
        title: 'Lawn Mower',
        description: 'A lawn mower (mower, etc.) is a machine utilizing one or more revolving blades to cut a grass surface to an even height. The height of the cut grass may be fixed by the design of the mower, but generally is adjustable by the operator, typically by a single master lever, or by a lever or nut and bolt on each of the machine\'s wheels.',
        image_path: 'lawnmower.jpg',
        requested_at: null,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 2,
        user_id: 1,
        title: 'Hammer',
        description: 'Heavy, sturdy, fairly new. Perfect for a little bit of home improvement. Please do not damage it as it is an heirloom from my great grandfather.',
        image_path: 'tools.jpg',
        requested_at: null,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 3,
        user_id: 1,
        title: 'Javascript for Kids',
        description: 'Perfect for beginners and intermediates alike. The book touches on JS fundamentals and some jQuery. Highly recommend you check it out!',
        image_path: 'book.jpg',
        requested_at: null,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 4,
        user_id: 3,
        title: 'US Flag',
        description: '\'MURICAAAAAA!!',
        image_path: 'usflag.jpg',
        requested_at: null,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 5,
        user_id: 5,
        title: 'Wealth of Knowledge',
        description: 'I\'m an awesome teacher with awesome knowledge to share -- but only to the most awesome of students.',
        image_path: 'brain.png',
        requested_at: null,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 6,
        user_id: 4,
        title: 'Crockpot',
        description: 'I haven\'t had time to cook lately so I thought I\'d put this up on LENDit. Great for pot roasts, stews, and etc. :)',
        image_path: 'pot.jpg',
        requested_at: null,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 7,
        user_id: 6,
        title: 'Star Wars: Episode I DVD',
        description: 'Best of the movie of the franchise, hands down.',
        image_path: 'starwars.png',
        requested_at: null,
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
