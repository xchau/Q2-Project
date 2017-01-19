'use strict';

exports.seed = function(knex) {
  return knex('items').del()
    .then(() => {
      return knex('items').insert([{
        id: 1,
        user_id: 1,
        title: 'Lawn mower',
        description: 'A lawn mower (mower, etc.) is a machine utilizing one or more revolving blades to cut a grass surface to an even height. The height of the cut grass may be fixed by the design of the mower, but generally is adjustable by the operator, typically by a single master lever, or by a lever or nut and bolt on each of the machine\'s wheels.',
        image_path: 'tools.jpg',
        requested_at: null,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 2,
        user_id: 2,
        title: 'hammer',
        description: 'A hammer is a tool or device that delivers a blow (a sudden impact) to an object. Most hammers are hand tools used to drive nails, fit parts, forge metal, and break apart objects. Hammers vary in shape, size, and structure, depending on their purposes.',
        image_path: 'tools.jpg',
        requested_at: null,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 3,
        user_id: 1,
        title: 'Mr. Meow',
        description: 'A hammer is a tool or device that delivers a blow (a sudden impact) to an object. Most hammers are hand tools used to drive nails, fit parts, forge metal, and break apart objects. Hammers vary in shape, size, and structure, depending on their purposes.',
        image_path: 'cat.jpg',
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
