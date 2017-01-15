'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('items', (table) => {
    table.increments();
    table.integer('user_id')
      .references('users.id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    table.string('title')
      .notNullable()
      .defaultTo('');
    table.text('description')
      .notNullable()
      .defaultTo('');
    table.timestamp('requested');
    table.timestamp('borrowed');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('items');
};
