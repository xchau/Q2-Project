'use strict';

exports.seed = function(knex) {
  return knex('comments').del()
    .then(() => {
      return knex('comments').insert([{
        id: 1,
        item_id: 1,
        user_id: 1,
        comment: 'This thing cuts grass like no other!'
      }, {
        id: 2,
        item_id: 2,
        user_id: 2,
        comment: 'This hammer was too heavy.'
      }, {
        id: 3,
        item_id: 2,
        user_id: 4,
        comment: 'Nailed up some family portraits with this thing. Worked like a charm!'
      }, {
        id: 4,
        item_id: 1,
        user_id: 3,
        comment: 'Thanks for letting me borrow your lawn mower. Let\'s see what the HOA has to say now!'
      }, {
        id: 5,
        item_id: 1,
        user_id: 5,
        comment: 'Yo, this lawn mower is legit. 10/10 would borrow again.'
      }, {
        id: 6,
        item_id: 2,
        user_id: 2,
        comment: 'I make $5000/wk from home. FIND OUT HOW: @ www.getrich.com!!'
      }, {
        id: 7,
        item_id: 3,
        user_id: 6,
        comment: 'First!'
      }, {
        id: 8,
        item_id: 3,
        user_id: 1,
        comment: 'This really helped me prepare for an intensive web-dev program!'
      }, {
        id: 9,
        item_id: 4,
        user_id: 6,
        comment: 'Colors are a little faded.'
      }, {
        id: 10,
        item_id: 5,
        user_id: 2,
        comment: 'My brain hurts.'
      }, {
        id: 11,
        item_id: 6,
        user_id: 5,
        comment: 'Made a sweet-ass pot roast. Thanks for the lend.'
      }, {
        id: 12,
        item_id: 8,
        user_id: 4,
        comment: 'Super slick roller heels. Great for so many occasions! Not so safe though.'
      }, {
        id: 13,
        item_id: 7,
        user_id: 1,
        comment: 'Episode II is the best bro.'
      }]);
    })
    .then(() => {
      return knex.raw(
       "SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments));"
     );
    });
};
