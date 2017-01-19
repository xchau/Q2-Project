'use strict';

exports.seed = function(knex) {
  return knex('users').del()
    .then(() => {
      return knex('users').insert([{
        id: 1,
        name: 'Hiromi',
        email: 'hiromi@galvanize.com',
        h_pw: '$2a$12$LaKBUi8mCFc/9LiCtvwcvuNIjgaq9LJuy/NO.m4P5.3FP8zA6t2Va',
        user_image_path: 'user1.jpg',
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 2,
        name: 'Minh',
        email: 'minh@galvanize.com',
        h_pw: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS',
        user_image_path: 'baby.jpg',
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 3,
        name: 'Camacho',
        email: 'camacho@us.gov',
        h_pw: '$2a$12$RTUorQd7Uq0zBN2XBJ6QGOdlVcajn0/JPWkSeYdqAXZkcxGYdh4ly',
        user_image_path: 'thor-hammer.jpg',
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }, {
        id: 4,
        name: 'Trump',
        email: 'trump@trump.com',
        h_pw: '$2a$12$7mLys2kgKrh5zoSaKqO0LeNkT4jSwMi/ehdRnSct0kheeO5QWkbv2',
        user_image_path: 'thor-hammer.jpg',
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
       "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
     );
    });
};
