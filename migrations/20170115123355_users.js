'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('name').notNullable().defaultTo('');
    table.string('email').unique().notNullable();
    table.specificType('h_pw', 'char(60)').notNullable();
    table.string('user_image_path')
      .notNullable()
      .defaultTo('user1.jpg');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
