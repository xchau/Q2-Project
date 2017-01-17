'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('comments', (table) => {
    table.increments();
    table.integer('item_id')
      .references('id')
      .inTable('items')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    table.integer('user_id')
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    table.text('comment')
      .notNullable()
      .defaultTo('');
    table.timestamps(true, true)
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments');
};
