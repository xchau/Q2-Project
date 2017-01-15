'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('fav_items', (table) => {
    table.increments();
    table.integer('item_id')
      .notNullable()
      .references('id')
      .inTable('items')
      .onDelete('CASCADE')
      .index();
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();
    table.timestamp('fav_at').defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('fav_items');
};
