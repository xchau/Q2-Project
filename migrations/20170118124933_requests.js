
exports.up = function(knex) {
  return knex.schema.createTable('requests', (table) => {
    table.increments();
    table.integer('item_id')
      .notNullable()
      .references('id')
      .inTable('items')
      .onDelete('CASCADE')
      .index();
    table.integer('user_id')
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    table.integer('borrow_id')
      .notNullable()
      .index();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('requests');
};
